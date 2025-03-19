"use client";
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

interface PaymentJob {
  id: string;
  amount: number;
  retries: number;
  status: "pending" | "processing" | "success" | "failed";
}

interface PaymentQueueContextType {
  addPaymentJob: (amount: number) => void;
  queue: PaymentJob[];
  removeFailedJob: (id: string) => void;
}

const PaymentQueueContext = createContext<PaymentQueueContextType | undefined>(undefined);

export const usePaymentQueue = () => {
  const context = useContext(PaymentQueueContext);
  if (!context) throw new Error("usePaymentQueue must be used within a PaymentRetryQueueProvider");
  return context;
};

const mockPaymentApi = (amount: number) => {
  console.log("🚀 ~ mockPaymentApi ~ amount:", amount);
  return new Promise<boolean>(
    (resolve) => setTimeout(() => resolve(Math.random() > 0.4), 1000) // 60% success rate
  );
};

export const PaymentRetryQueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<PaymentJob[]>([]);
  const processingJobs = useRef<Set<string>>(new Set());

  const addPaymentJob = (amount: number) => {
    setQueue((prev) => [...prev, { id: Date.now().toString(), amount, retries: 0, status: "pending" }]);
  };

  const removeFailedJob = (id: string) => {
    setQueue((prev) => prev.filter((job) => job.id !== id));
  };

  const processJob = useCallback(async (job: PaymentJob) => {
    if (processingJobs.current.has(job.id)) return;
    processingJobs.current.add(job.id);

    setQueue((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: "processing" } : j)));

    const success = await mockPaymentApi(job.amount);

    if (success) {
      setQueue((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: "success" } : j)));
    } else {
      if (job.retries + 1 >= 3) {
        setQueue((prev) => prev.map((j) => (j.id === job.id ? { ...j, retries: j.retries + 1, status: "failed" } : j)));
      } else {
        setQueue((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, retries: j.retries + 1, status: "pending" } : j))
        );
      }
    }

    processingJobs.current.delete(job.id);
  }, []);

  useEffect(() => {
    queue.filter((job) => job.status === "pending" && job.retries < 3).forEach((job) => processJob(job));
  }, [queue, processJob]);

  return (
    <PaymentQueueContext.Provider value={{ addPaymentJob, queue, removeFailedJob }}>
      {children}
    </PaymentQueueContext.Provider>
  );
};

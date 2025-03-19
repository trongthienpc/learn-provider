"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface PaymentJob {
  id: string;
  amount: number;
  retries: number;
  status: "pending" | "processing" | "success" | "failed";
}

interface PaymentQueueProps {
  addPaymentJob: (amount: number) => void;
  removeFailedJob: (id: string) => void;
  queue: PaymentJob[];
}

const PaymentQueueFIFOContext = createContext<PaymentQueueProps | undefined>(undefined);

export const usePaymentQueueFIFO = () => {
  const context = useContext(PaymentQueueFIFOContext);

  if (!context) throw new Error("usePaymentQueueFIFO must be used within a context provider");

  return context;
};

const mockPaymentApi = (amount: number) => {
  console.log("🚀 ~ mockPaymentApi ~ amount:", amount);
  return new Promise<boolean>((resolve) => setTimeout(() => resolve(Math.random() > 0.4), 2000));
};

export const PaymentQueueFIFOProvider = ({ children }: { children: React.ReactNode }) => {
  const [queue, setQueue] = useState<PaymentJob[]>([]);
  const queueRef = useRef<PaymentJob[]>([]);
  const isProcessing = useRef<boolean>(false);

  // update queueRef every queue change
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  const addPaymentJob = (amount: number) => {
    const newJob: PaymentJob = {
      id: Date.now().toString(),
      amount,
      retries: 0,
      status: "pending",
    };
    setQueue((prev) => [...prev, newJob]);
  };

  const removeFailedJob = (id: string) => {
    setQueue((prev) => prev.filter((x) => x.id !== id));
  };

  const processQueue = async () => {
    if (isProcessing.current) return;

    const nextJob = queueRef.current.find((job) => job.status === "pending" && job.retries < 3);

    if (!nextJob) return;

    isProcessing.current = true;

    // flag job as processing
    setQueue((prev) => prev.map((x) => (x.id === nextJob.id ? { ...x, status: "processing" } : x)));

    const success = await mockPaymentApi(nextJob.amount);

    if (success) {
      setQueue((prev) => prev.map((x) => (x.id === nextJob.id ? { ...x, status: "success" } : x)));
    } else {
      setQueue((prev) =>
        prev.map((x) =>
          x.id === nextJob.id
            ? {
                ...x,
                retries: x.retries + 1,
                status: x.retries + 1 >= 3 ? "failed" : "pending",
              }
            : x
        )
      );
    }

    isProcessing.current = false;

    setTimeout(() => processQueue(), 1000);
  };

  useEffect(() => {
    if (!isProcessing.current) processQueue();
  }, [queue]);

  return (
    <PaymentQueueFIFOContext.Provider value={{ addPaymentJob, removeFailedJob, queue }}>
      {children}
    </PaymentQueueFIFOContext.Provider>
  );
};

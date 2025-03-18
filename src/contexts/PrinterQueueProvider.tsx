"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export interface PrintJob {
  id: string;
  content: string;
  status: "pending" | "printing" | "done" | "cancelled";
}

interface PrintQueueContextType {
  addPrintJob: (content: string) => void;
  cancelJob: (id: string) => void;
  clearQueue: () => void;
  queue: PrintJob[];
}

const mockPrint = async (content: string) => {
  console.log("Printing:", content);
  return new Promise((resolve) => setTimeout(resolve, 3000));
};

const PrintQueueContext = createContext<PrintQueueContextType | undefined>(undefined);

export const usePrintQueue = () => {
  const context = useContext(PrintQueueContext);
  if (!context) throw new Error("usePrintQueue must be used within the provider");
  return context;
};

export const PrintQueueProvider = ({ children }: { children: React.ReactNode }) => {
  const [queue, setQueue] = useState<PrintJob[]>([]);
  const queueRef = useRef<PrintJob[]>([]);
  const isPrinting = useRef(false);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  const addPrintJob = (content: string) => {
    const id = Date.now().toString();
    setQueue((prev) => [...prev, { id, content, status: "pending" }]);
  };

  const cancelJob = (id: string) => {
    setQueue((prev) => prev.map((job) => (job.id === id ? { ...job, status: "cancelled" } : job)));
  };

  const clearQueue = () => setQueue([]);

  const processQueue = async () => {
    if (isPrinting.current) return;
    isPrinting.current = true;

    while (true) {
      const currentQueue = queueRef.current;
      const nextJob = currentQueue.find((job) => job.status === "pending");

      if (!nextJob) break;

      // Đánh dấu job là printing
      setQueue((prev) => prev.map((job) => (job.id === nextJob.id ? { ...job, status: "printing" } : job)));

      // In job
      await mockPrint(nextJob.content);

      // Đánh dấu job là done (nếu chưa bị huỷ)
      const jobAfterPrint = queueRef.current.find((job) => job.id === nextJob.id);
      if (jobAfterPrint && jobAfterPrint.status === "printing") {
        setQueue((prev) => prev.map((job) => (job.id === nextJob.id ? { ...job, status: "done" } : job)));
      }
    }

    isPrinting.current = false;
  };

  useEffect(() => {
    if (!isPrinting.current && queue.some((job) => job.status === "pending")) {
      processQueue();
    }
  }, [queue]);

  return (
    <PrintQueueContext.Provider value={{ addPrintJob, cancelJob, clearQueue, queue }}>
      {children}
    </PrintQueueContext.Provider>
  );
};

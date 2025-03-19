"use client";
import { useContext, createContext, useState, useRef, useEffect } from "react";

interface NotificationJob {
  id: string;
  message: string;
  status: "pending" | "sending" | "complete" | "failed";
}

interface NotificationQueueProps {
  enqueueNotification: (message: string) => void;
  queue: NotificationJob[];
  clearQueue: () => void;
}

const NotificationQueueContext = createContext<NotificationQueueProps | undefined>(undefined);

export const useNotificationQueue = () => {
  const context = useContext(NotificationQueueContext);

  if (!context) throw new Error("useNotificationQueue must be used within a notification provider");

  return context;
};

const mockSendNotification = (message: string) => {
  console.log(message);
  return new Promise((resolve) => setTimeout(() => resolve(Math.random() > 0.2), 1000));
};

export const NotificationQueueProvider = ({ children }: { children: React.ReactNode }) => {
  const [queue, setQueue] = useState<NotificationJob[]>([]);
  const notificationsRef = useRef<NotificationJob[]>([]);
  const isSending = useRef<boolean>(false);

  useEffect(() => {
    notificationsRef.current = queue;
  }, [queue]);

  const enqueueNotification = (message: string) => {
    const newNotification: NotificationJob = {
      id: Date.now().toString(),
      message,
      status: "pending",
    };
    setQueue((prev) => [...prev, newNotification]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const processQueue = async () => {
    if (isSending.current) return;
    isSending.current = true;

    for (let i = 0; i < notificationsRef.current.length; i++) {
      const queue = notificationsRef.current[i];
      if (queue.status === "pending") {
        setQueue((prev) => prev.map((x) => (x.id === queue.id ? { ...x, status: "sending" } : x)));

        const success = await mockSendNotification(queue.id);
        setQueue((prev) =>
          prev.map((x) => (x.id === queue.id ? { ...x, status: success ? "complete" : "failed" } : x))
        );
      }
    }

    isSending.current = false;
  };

  useEffect(() => {
    if (!isSending.current && queue.some((job) => job.status === "pending")) {
      processQueue();
    }
  }, [queue]);

  return (
    <NotificationQueueContext.Provider value={{ clearQueue, enqueueNotification, queue }}>
      {children}
    </NotificationQueueContext.Provider>
  );
};

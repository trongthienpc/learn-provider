"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface NotificationProps {
  addNotification: (msg: string) => void;
}

// create context for notification
const NotificationContext = createContext<NotificationProps | undefined>(undefined);

// create customer hook to use notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) throw new Error("useNotification must be used within a notification provider");

  return context;
};

// create provider to manage notification
export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [queue, setQueue] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(null);

  const addNotification = (msg: string) => setQueue((prev) => [...prev, msg]);

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue((prev) => prev.slice(1));

      setTimeout(() => setCurrent(null), 1000);
    }
  }, [current, queue]);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      {current && <div className="fixed top-4 right-4 bg-black text-white p-3">{current}</div>}
    </NotificationContext.Provider>
  );
};

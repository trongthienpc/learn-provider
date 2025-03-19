"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

interface EmailJob {
  id: string;
  email: string;
  subject: string;
  body: string;
  retries: number;
  status: "pending" | "sending" | "sent" | "error";
}

interface EmailQueueProps {
  enqueueEmail: (email: string, subject: string, body: string) => void;
  resetJob: (id: string) => void;
  removeJob: (id: string) => void;
  queue: EmailJob[];
}

const EmailQueueContext = createContext<EmailQueueProps | undefined>(undefined);

export const useEmailQueue = () => {
  const context = useContext(EmailQueueContext);

  if (!context) throw new Error("useEmailQueue must be used within a email provider");

  return context;
};

const mockSendEmail = async (email: string, subject: string, body: string) => {
  console.log(email, subject, body);
  return new Promise((resolve) => setTimeout(() => resolve(Math.random() > 0.8), 800));
};

export const EmailQueueProvider = ({ children }: { children: React.ReactNode }) => {
  const [queue, setQueue] = useState<EmailJob[]>([]);
  const emailRef = useRef<EmailJob[]>([]);
  const isSending = useRef<boolean>(false);

  useEffect(() => {
    emailRef.current = queue;
  }, [queue]);

  const enqueueEmail = (email: string, subject: string, body: string) => {
    const newEmail: EmailJob = {
      id: Date.now().toString(),
      email,
      subject,
      body,
      retries: 0,
      status: "pending",
    };

    setQueue((prev) => [...prev, newEmail]);
  };

  const resetJob = (id: string) => {
    setQueue((prev) => prev.map((x) => (x.id === id ? { ...x, status: "pending" } : x)));
  };

  const removeJob = (id: string) => {
    setQueue((prev) => prev.filter((x) => x.id !== id));
  };

  const processNextJob = async () => {
    if (isSending.current) return;

    const nextJob = emailRef.current.find((x) => x.status === "pending");

    if (!nextJob) return;

    isSending.current = true;

    setQueue((prev) => prev.map((x) => (x.id === nextJob.id ? { ...x, status: "sending" } : x)));

    const success = await mockSendEmail(nextJob.email, nextJob.subject, nextJob.body);

    if (success) {
      setQueue((prev) => prev.map((x) => (x.id === nextJob.id ? { ...x, status: success ? "sent" : "error" } : x)));
    } else {
      setQueue((prev) =>
        prev.map((x) =>
          x.id === nextJob.id
            ? {
                ...x,
                retries: nextJob.retries + 1,
                status: nextJob.retries + 1 >= 3 ? "error" : "pending",
              }
            : x
        )
      );
    }

    isSending.current = false;

    setTimeout(() => processNextJob(), 1000);
  };

  useEffect(() => {
    if (!isSending.current && queue.some((x) => x.status === "pending")) {
      processNextJob();
    }
  }, [queue]);

  return (
    <EmailQueueContext.Provider value={{ enqueueEmail, queue, removeJob, resetJob }}>
      {children}
    </EmailQueueContext.Provider>
  );
};

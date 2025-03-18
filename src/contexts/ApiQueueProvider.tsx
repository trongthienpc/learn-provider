/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useRef, useState } from "react";

interface ApiQueueContextProps {
  enqueueRequest: (fn: () => Promise<any>) => void;
}

// 1. create a new context
const ApiQueueContext = createContext<ApiQueueContextProps | undefined>(undefined);

// 2. create a custom hook
export const useApiQueue = () => {
  const context = useContext(ApiQueueContext);

  if (!context) throw new Error("useApiQueue must be used with an Api queue context");

  return context;
};

export const ApiQueueProvider = ({ children }: { children: React.ReactNode }) => {
  const requestQueue = useRef<(() => Promise<any>)[]>([]);
  const [isProcessing, setProcessing] = useState(false);

  const enqueueRequest = (fn: () => Promise<any>) => {
    requestQueue.current.push(fn);
    if (!isProcessing) processQueue();
  };

  const processQueue = async () => {
    if (isProcessing || requestQueue.current.length === 0) return;

    setProcessing(true);

    while (requestQueue.current.length > 0) {
      const nextRequest = requestQueue.current.shift();
      if (nextRequest) {
        try {
          await nextRequest();
        } catch (error) {
          console.error("API request failed: ", error);
        }
      }
    }

    setProcessing(false);
  };
  return <ApiQueueContext.Provider value={{ enqueueRequest }}>{children}</ApiQueueContext.Provider>;
};

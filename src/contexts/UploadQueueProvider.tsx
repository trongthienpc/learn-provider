"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface UploadItem {
  file: File;
  status: "pending" | "uploading" | "done" | "error";
}

interface UploadQueueProps {
  enqueueFile: (file: File) => void;
  queue: UploadItem[];
}

const UploadQueueContext = createContext<UploadQueueProps | undefined>(undefined);

export const useUploadQueue = () => {
  const context = useContext(UploadQueueContext);
  if (!context) throw new Error("useUploadQueue must be used within a Upload Queue context");

  return context;
};

const mockUploadToMinIO = async (file: File) => {
  console.log("🚀 ~ mockUploadToMinIO ~ file:", file.name);
  return new Promise((resolve) => setTimeout(resolve, 3000));
};
const mockSaveMetadata = async (file: File) => {
  console.log("🚀 ~ mockSaveMetadata ~ file:", file);
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export const FileUploadQueueProvider = ({ children }: { children: React.ReactNode }) => {
  const [queue, setQueue] = useState<UploadItem[]>([]);
  console.log("🚀 ~ FileUploadQueueProvider ~ queue:", queue);
  const isUploading = useRef(false);

  const enqueueFile = (file: File) => {
    setQueue((prev) => [...prev, { file, status: "pending" }]);
  };

  const processQueue = async () => {
    if (isUploading.current) return;
    isUploading.current = true;

    for (let i = 0; i < queue.length; i++) {
      if (queue[i].status === "pending") {
        setQueue((prev) => prev.map((item, index) => (index === i ? { ...item, status: "uploading" } : item)));
      }

      try {
        await mockUploadToMinIO(queue[i].file);
        await mockSaveMetadata(queue[i].file);

        setQueue((prev) => prev.map((item, index) => (index === i ? { ...item, status: "done" } : item)));
      } catch {
        setQueue((prev) => prev.map((item, index) => (index === i ? { ...item, status: "error" } : item)));
      }
    }

    isUploading.current = false;
  };

  useEffect(() => {
    if (!isUploading.current && queue.some((item) => item.status === "pending")) {
      processQueue();
    }
  }, [queue]);

  return <UploadQueueContext.Provider value={{ enqueueFile, queue }}>{children}</UploadQueueContext.Provider>;
};

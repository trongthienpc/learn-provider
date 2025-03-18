"use client";
import { useUploadQueue } from "@/contexts/UploadQueueProvider";
import React from "react";
import { Input } from "./ui/input";
import { Check, CloudUpload, LoaderCircle } from "lucide-react";

const Upload = () => {
  const { enqueueFile, queue } = useUploadQueue();
  const handleFile = (files: FileList | null) => {
    if (!files) return;

    for (const file of files) {
      enqueueFile(file);
    }
  };
  return (
    <div>
      <h2>Import files</h2>
      <Input type="file" multiple onChange={(e) => handleFile(e.target.files)} />
      <ul>
        {queue.map((item, index) => (
          <li
            key={index}
            className="flex gap-3 items-center justify-between px-3 py-1 border border-dashed my-1 rounded"
          >
            {item?.file?.name} -{" "}
            {item?.status === "pending" ? (
              <LoaderCircle className="animate-spin w-4 h-4" />
            ) : item?.status === "uploading" ? (
              <CloudUpload className="animate-ping w-4 h-4" />
            ) : (
              <Check className="text-green-500" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Upload;

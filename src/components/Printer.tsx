"use client";
import React, { useEffect, useRef } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { PrintJob, usePrintQueue } from "@/contexts/PrinterQueueProvider";
import { X } from "lucide-react";

const Printer = () => {
  const { addPrintJob, cancelJob, queue, clearQueue } = usePrintQueue();

  const prevQueueRef = useRef<PrintJob[]>([]);

  useEffect(() => {
    const prevQueue = prevQueueRef.current;

    // So sánh job nào chuyển từ không done -> done
    const newlyDoneJobs = queue.filter((job) => {
      const prevJob = prevQueue.find((j) => j.id === job.id);
      return prevJob && prevJob.status !== "done" && job.status === "done";
    });

    if (newlyDoneJobs.length > 0) {
      const audio = new Audio("/done-sound.mp3");
      audio.play();
    }

    prevQueueRef.current = queue;
  }, [queue]);

  const pendingCount = queue.filter((q) => q.status === "pending").length;
  const printingJob = queue.find((q) => q.status === "printing");

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-xl shadow-lg">
      <Label className="text-xl font-semibold">Printer Queue</Label>
      <div className="flex gap-3 items-center mb-4">
        <Button onClick={() => addPrintJob(`Invoice #${Date.now()}`)}>Add Print Job</Button>
        <Button variant="destructive" onClick={clearQueue}>
          Clear Queue
        </Button>
      </div>

      <div className="mb-3">
        <div className="text-sm text-muted-foreground">
          {printingJob ? `Currently printing: ${printingJob.content}` : "No job printing"}
        </div>
        <div className="text-sm text-muted-foreground">Pending jobs: {pendingCount}</div>
      </div>

      <ul className="space-y-2">
        {queue.map((q) => (
          <li
            key={q.id}
            className={`flex items-center justify-between border rounded-md px-3 py-2 ${
              q.status === "printing"
                ? "bg-yellow-100 border-yellow-400"
                : q.status === "done"
                ? "bg-green-100 border-green-400"
                : q.status === "cancelled"
                ? "bg-red-100 border-red-400"
                : ""
            }`}
          >
            <div>
              {q.content} - <span className="capitalize text-xs text-gray-500">{q.status}</span>
            </div>
            {q.status === "pending" && (
              <Button size="icon" variant="ghost" onClick={() => cancelJob(q.id)}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Printer;

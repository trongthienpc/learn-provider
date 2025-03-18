"use client";
import React from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { usePrintQueue } from "@/contexts/PrinterQueueProvider";
import { X } from "lucide-react";

const Printer = () => {
  const { addPrintJob, cancelJob, queue, clearQueue } = usePrintQueue();
  return (
    <div className="flex flex-col gap-3">
      <Label>Printer Queue</Label>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 items-center">
          <Button className="select-none" onClick={() => addPrintJob("Invoice #12345")}>
            Add Print Job
          </Button>
          <Button onClick={() => clearQueue()}>Clear Queue</Button>
        </div>
        <div>
          <ul>
            {queue.map((q, i) => (
              <li key={i}>
                {q.content} - {q.status}
                {q.status === "pending" && (
                  <Button onClick={() => cancelJob(q.id)}>
                    <X />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Printer;

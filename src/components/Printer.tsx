"use client";
import React from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { usePrintQueue } from "@/contexts/PrinterQueueProvider";
import { X } from "lucide-react";
import { usePlaySound } from "@/hooks/usePlaysound";
import { useDetectStatusChange } from "@/hooks/useDetectStatusChange";

const Printer = () => {
  const { addPrintJob, cancelJob, queue, clearQueue } = usePrintQueue();
  const playDoneSound = usePlaySound("/done-sound.mp3");

  useDetectStatusChange(queue, "done", () => {
    playDoneSound();
  });

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-xl shadow-lg">
      <Label className="text-xl font-semibold">Printer Queue</Label>
      <div className="flex gap-3 items-center mb-4">
        <Button onClick={() => addPrintJob(`Invoice #${Date.now()}`)}>Add Print Job</Button>
        <Button variant="destructive" onClick={clearQueue}>
          Clear Queue
        </Button>
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

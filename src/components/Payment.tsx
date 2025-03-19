"use client";
import { usePaymentQueue } from "@/contexts/PyamentQueueProvider";
import React from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

const Payment = () => {
  const { addPaymentJob, queue, removeFailedJob } = usePaymentQueue();
  return (
    <div>
      <Button onClick={() => addPaymentJob(Math.floor(Math.random() * 500) + 50)}>Add Random Payment</Button>
      <ul>
        {queue.map((job) => (
          <li key={job.id}>
            Amount: ${job.amount} - Status: {job.status} - Retries: {job.retries}
            {job.status === "failed" && (
              <Button variant={"ghost"} size={"icon"} onClick={() => removeFailedJob(job.id)}>
                <X />
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Payment;

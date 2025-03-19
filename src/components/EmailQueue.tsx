"use client";
import { useEmailQueue } from "@/contexts/EmailQueueProvider";
import React from "react";
import { Button } from "./ui/button";
import { Cylinder, X } from "lucide-react";

const EmailQueue = () => {
  const { enqueueEmail, queue, removeJob, resetJob } = useEmailQueue();
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-3">
      <Button onClick={() => enqueueEmail("zubu@gmail.com", "test", "How's going?")}>Add Email</Button>
      <ul>
        {queue.map((x) => (
          <li key={x.id}>
            To: {x.email}, subject: {x.subject}, status: {x.status}
            {x.status === "error" && (
              <>
                <Button variant={"ghost"} size={"icon"} onClick={() => resetJob(x.id)}>
                  <Cylinder />
                </Button>
                <Button variant={"ghost"} size={"icon"} onClick={() => removeJob(x.id)}>
                  <X />
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailQueue;

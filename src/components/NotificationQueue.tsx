"use client";
import React from "react";
import { Button } from "./ui/button";
import { useNotificationQueue } from "@/contexts/NotificationQueueProvider";

const NotificationQueue = () => {
  const { clearQueue, enqueueNotification, queue } = useNotificationQueue();
  return (
    <div>
      <Button onClick={() => enqueueNotification("New message received!")}>Send Notification</Button>
      <Button onClick={() => clearQueue()}>Clear Queue</Button>
      <ul>
        {queue.map((job) => (
          <li key={job.id}>
            {job.message} - {job.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationQueue;

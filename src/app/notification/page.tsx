import NotificationQueue from "@/components/NotificationQueue";
import { NotificationQueueProvider } from "@/contexts/NotificationQueueProvider";
import React from "react";

const Notification = () => {
  return (
    <div className="flex items-center justify-center max-w-5xl mx-auto h-screen">
      <NotificationQueueProvider>
        <NotificationQueue />
      </NotificationQueueProvider>
    </div>
  );
};

export default Notification;

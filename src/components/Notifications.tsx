"use client";
import { useNotification } from "@/contexts/NotificationProvider";
import React from "react";
import { Button } from "./ui/button";

const Notifications = () => {
  const { addNotification } = useNotification();
  return (
    <div className="flex items-center justify-center">
      <Button onClick={() => addNotification("Hi three ")}>Send message</Button>
    </div>
  );
};

export default Notifications;

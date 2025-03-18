"use client";
import { useSpeechQueue } from "@/contexts/SpeechQueueProvider";
import React from "react";
import { Button } from "./ui/button";

const Speech = () => {
  const { enqueueText, isSpeaking, queue } = useSpeechQueue();
  return (
    <div className="flex gap-3 flex-col">
      <div className="flex gap-3">
        <Button onClick={() => enqueueText("Xin mời khách hàng số 111, Đến quầy tiếp nhận thông tin số 2")}>
          Speak &quot;xin chào&quot;
        </Button>
        <Button onClick={() => enqueueText("Đến quầy tiếp thông tin số 2")}>Speak tiếp</Button>
      </div>
      <div>Current Queue: {queue.join(", ")}</div>
      <div>Speaking: {isSpeaking ? "Yes" : "No"}</div>
    </div>
  );
};

export default Speech;

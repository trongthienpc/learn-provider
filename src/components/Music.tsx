"use client";
import { useMusicQueue } from "@/contexts/MusicQueueProvider";
import React from "react";
import { Button } from "./ui/button";

const Music = () => {
  const { addSong } = useMusicQueue();
  return (
    <div className="flex gap-3">
      <Button onClick={() => addSong("Song A")}>Add Song A</Button>
      <Button onClick={() => addSong("Song B")}>Add Song B</Button>
    </div>
  );
};

export default Music;

"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface MusicQueueProps {
  addSong: (song: string) => void;
}

// 1. Create a new MusicQueue context
const MusicQueueContext = createContext<MusicQueueProps | undefined>(undefined);

// 2. Create a custom hook to use music queue
export const useMusicQueue = () => {
  const context = useContext(MusicQueueContext);
  if (!context) throw new Error("useMusicQueue must be used within a MusicQueue context");

  return context;
};

// 3. Create provider

export const MusicQueueProvider = ({ children }: { children: React.ReactNode }) => {
  const [queue, setQueue] = useState<string[]>([]);
  const [currentSong, setCurrentSong] = useState<string | null>(null);

  const addSong = (song: string) => setQueue((prev) => [...prev, song]);

  useEffect(() => {
    if (!currentSong && queue.length > 0) {
      setCurrentSong(queue[0]);
      setQueue((prev) => prev.slice(1));

      setTimeout(() => setCurrentSong(null), 5000);
    }
  }, [currentSong, queue]);
  return (
    <MusicQueueContext.Provider value={{ addSong }}>
      {children}

      <div>
        <h2>Now Playing: {currentSong || "No song"}</h2>
        <h3>Queue: {queue.join(", ")}</h3>
      </div>
    </MusicQueueContext.Provider>
  );
};

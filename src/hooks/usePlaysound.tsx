import { useCallback } from "react";

export const usePlaySound = (url: string) => {
  return useCallback(() => {
    const audio = new Audio(url);
    audio.play().catch((err) => console.error("Audio play failed: " + err));
  }, [url]);
};

"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface SpeechQueueProps {
  enqueueText: (text: string) => void;
  queue: string[];
  isSpeaking: boolean;
}

const SpeechQueueContext = createContext<SpeechQueueProps | undefined>(undefined);

export const useSpeechQueue = () => {
  const context = useContext(SpeechQueueContext);
  if (!context) throw new Error("useSpeechQueue must be used within a Speech Provider");

  return context;
};

export const SpeechQueueProvider = ({ children }: { children: React.ReactNode }) => {
  const [queue, setQueue] = useState<string[]>([]);
  const textQueue = useRef<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const enqueueText = (text: string) => {
    textQueue.current.push(text);
    setQueue([...textQueue.current]);
  };

  const processQueue = () => {
    if (isSpeaking || textQueue.current.length === 0) return;
    const text = textQueue.current.shift();

    if (text) {
      setQueue([...textQueue.current]);
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const vietnameseVoice = voices.find(
        (voice) => voice.lang === "vi-VN" || voice.lang === "vi" || voice.lang.startsWith("vi")
      );

      if (vietnameseVoice) {
        utterance.voice = vietnameseVoice;
      } else {
        console.warn("Vietnamese voice not found. Using default voice.");
      }
      utterance.onend = () => {
        setIsSpeaking(false);
        processQueue();
      };

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (!isSpeaking && textQueue.current.length > 0) {
      processQueue();
    }
  }, [isSpeaking, queue]);

  return (
    <SpeechQueueContext.Provider value={{ enqueueText, queue, isSpeaking }}>{children}</SpeechQueueContext.Provider>
  );
};

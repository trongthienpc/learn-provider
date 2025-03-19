import { useEffect, useRef } from "react";

interface DetectStatusChangeItem {
  id: string;
  status: string;
}

export function useDetectStatusChange<T extends DetectStatusChangeItem>(
  items: T[],
  targetStatus: string,
  onStatusChange: (item: T) => void
) {
  const prevItemRef = useRef<T[]>([]);

  useEffect(() => {
    const prevItems = prevItemRef.current;

    items.forEach((item) => {
      const prevItem = prevItems.find((p) => p.id === item.id);
      if (prevItem && prevItem.status !== targetStatus && item.status === targetStatus) {
        onStatusChange(item);
      }
    });

    prevItemRef.current = items;
  }, [items, onStatusChange, targetStatus]);
}

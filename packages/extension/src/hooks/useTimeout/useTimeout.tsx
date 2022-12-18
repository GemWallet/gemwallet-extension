import { useRef, useEffect } from 'react';

export const useTimeout = (duration: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (callback: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(callback, duration);
  };
};

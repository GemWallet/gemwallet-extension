import { useEffect } from 'react';

export const useKeyUp = (key: string, callback: () => void) => {
  useEffect(() => {
    const upHandler = ({ key: eventKey }: { key: string }) => {
      if (key === eventKey) {
        callback();
      }
    };
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keyup', upHandler);
    };
  }, [key, callback]);
};

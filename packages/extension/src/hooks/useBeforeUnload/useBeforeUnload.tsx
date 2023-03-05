import { useEffect } from 'react';

export const useBeforeUnload = (callback: () => void) => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Call the provided callback function before unloading
      callback();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [callback]);
};

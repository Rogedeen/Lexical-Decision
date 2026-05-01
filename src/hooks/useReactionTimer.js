import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for high-precision reaction time measurement.
 * Uses performance.now() for sub-millisecond accuracy.
 */
export const useReactionTimer = () => {
  const startTimeRef = useRef(null);
  const [reactionTime, setReactionTime] = useState(null);

  const startTimer = useCallback(() => {
    startTimeRef.current = performance.now();
    setReactionTime(null);
  }, []);

  const stopTimer = useCallback(() => {
    if (startTimeRef.current === null) return null;
    
    const endTime = performance.now();
    const rt = endTime - startTimeRef.current;
    setReactionTime(rt);
    startTimeRef.current = null;
    return rt;
  }, []);

  const resetTimer = useCallback(() => {
    startTimeRef.current = null;
    setReactionTime(null);
  }, []);

  return {
    startTimer,
    stopTimer,
    resetTimer,
    reactionTime
  };
};

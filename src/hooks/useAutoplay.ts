import { useCallback, useEffect, useRef, useState } from 'react';

type UseAutoplayOptions = {
  delay: number;
  enabled?: boolean;
  pauseOnHover?: boolean;
};

export function useAutoplay(callback: () => void, { delay, enabled = true }: UseAutoplayOptions) {
  const savedCallback = useRef(callback);
  const intervalRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const start = useCallback(() => {
    if (!enabled || delay <= 0) {
      clear();
      return;
    }

    if (intervalRef.current != null) return;

    intervalRef.current = window.setInterval(() => {
      savedCallback.current();
    }, delay);

    setIsPlaying(true);
  }, [clear, delay, enabled]);

  useEffect(() => {
    clear();
    start();

    const onVisibilityChange = () => {
      if (document.hidden) clear();
      else start();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clear();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [clear, start]);

  return {
    pause: clear,
    resume: start,
    isPlaying,
  };
}

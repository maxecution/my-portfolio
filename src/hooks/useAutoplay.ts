import { useEffect, useRef } from 'react';

type UseAutoplayOptions = {
  delay: number;
  enabled?: boolean;
  pauseOnHover?: boolean;
};

export function useAutoplay(callback: () => void, { delay, enabled = true }: UseAutoplayOptions) {
  const savedCallback = useRef(callback);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clear = () => {
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = () => {
    clear();
    if (!enabled) return;

    intervalRef.current = window.setInterval(() => {
      savedCallback.current();
    }, delay);
  };

  useEffect(() => {
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
  }, [delay, enabled]);

  return {
    pause: clear,
    resume: start,
  };
}

import { renderHook, act } from '@testing-library/react';
import { useAutoplay } from './useAutoplay';

describe('useAutoplay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('starts autoplay on mount and calls callback at interval', () => {
    const fn = jest.fn();

    renderHook(() => useAutoplay(fn, { delay: 500 }));

    act(() => jest.advanceTimersByTime(500));
    expect(fn).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(1000));
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test('uses latest callback after rerender', () => {
    const first = jest.fn();
    const second = jest.fn();

    const { rerender } = renderHook(({ cb }) => useAutoplay(cb, { delay: 500 }), { initialProps: { cb: first } });

    act(() => jest.advanceTimersByTime(500));
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();

    rerender({ cb: second });

    act(() => jest.advanceTimersByTime(500));
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  test('pause stops autoplay and updates isPlaying', () => {
    const fn = jest.fn();

    const { result } = renderHook(() => useAutoplay(fn, { delay: 300 }));

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.pause();
      jest.advanceTimersByTime(1000);
    });

    expect(fn).not.toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  test('resume restarts autoplay and updates isPlaying', () => {
    const fn = jest.fn();

    const { result } = renderHook(() => useAutoplay(fn, { delay: 400 }));

    act(() => result.current.pause());
    expect(result.current.isPlaying).toBe(false);

    act(() => {
      result.current.resume();
      jest.advanceTimersByTime(400);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(result.current.isPlaying).toBe(true);
  });

  test('resume does nothing if already running', () => {
    const fn = jest.fn();
    const setIntervalSpy = jest.spyOn(window, 'setInterval');

    const { result } = renderHook(() => useAutoplay(fn, { delay: 200 }));

    act(() => result.current.resume());
    act(() => result.current.resume());

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
  });

  test('does not start autoplay when enabled is false', () => {
    const fn = jest.fn();

    renderHook(() => useAutoplay(fn, { delay: 100, enabled: false }));

    act(() => jest.advanceTimersByTime(1000));
    expect(fn).not.toHaveBeenCalled();
  });

  test('does not start autoplay when delay <= 0', () => {
    const fn = jest.fn();

    renderHook(() => useAutoplay(fn, { delay: 0 }));

    act(() => jest.advanceTimersByTime(1000));
    expect(fn).not.toHaveBeenCalled();
  });

  test('pauses when document becomes hidden and resumes when visible', () => {
    const fn = jest.fn();

    renderHook(() => useAutoplay(fn, { delay: 500 }));

    act(() => jest.advanceTimersByTime(500));
    expect(fn).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, 'hidden', { configurable: true, value: true });

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
      jest.advanceTimersByTime(2000);
    });

    expect(fn).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, 'hidden', { configurable: true, value: false });

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
      jest.advanceTimersByTime(500);
    });

    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('cleans up interval and visibility listener on unmount', () => {
    const fn = jest.fn();
    const removeSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useAutoplay(fn, { delay: 300 }));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
  });
});

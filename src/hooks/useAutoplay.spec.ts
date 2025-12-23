import { renderHook, act, cleanup } from '@testing-library/react';
import { useAutoplay } from './useAutoplay';

describe('useAutoplay (renderHook)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it('starts interval and updates saved callback on rerender', () => {
    const cb1 = jest.fn();

    const { result, rerender } = renderHook(({ cb, opts }) => useAutoplay(cb, opts), {
      initialProps: { cb: cb1, opts: { delay: 1000 } },
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(cb1).toHaveBeenCalledTimes(1);

    const cb2 = jest.fn();
    rerender({ cb: cb2, opts: { delay: 1000 } });

    act(() => jest.advanceTimersByTime(1000));
    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledTimes(1);

    // ensure methods exist
    expect(typeof result.current.pause).toBe('function');
    expect(typeof result.current.resume).toBe('function');
  });

  it('pause and resume stop and start the interval', () => {
    const fn = jest.fn();
    const { result } = renderHook(({ cb, opts }) => useAutoplay(cb, opts), {
      initialProps: { cb: fn, opts: { delay: 500 } },
    });

    act(() => jest.advanceTimersByTime(500));
    expect(fn).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.pause();
      jest.advanceTimersByTime(2000);
    });
    expect(fn).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.resume();
      jest.advanceTimersByTime(500);
    });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does not start when enabled is false', () => {
    const fn = jest.fn();
    renderHook(({ cb, opts }) => useAutoplay(cb, opts), {
      initialProps: { cb: fn, opts: { delay: 100, enabled: false } },
    });

    act(() => jest.advanceTimersByTime(1000));
    expect(fn).not.toHaveBeenCalled();
  });

  it('pauses on document hidden and restarts when visible again', () => {
    const fn = jest.fn();
    renderHook(({ cb, opts }) => useAutoplay(cb, opts), {
      initialProps: { cb: fn, opts: { delay: 1000 } },
    });

    act(() => jest.advanceTimersByTime(1000));
    expect(fn).toHaveBeenCalledTimes(1);

    const original = Object.getOwnPropertyDescriptor(document, 'hidden');
    if (!original || original.configurable) {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    }

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
      jest.advanceTimersByTime(5000);
    });
    expect(fn).toHaveBeenCalledTimes(1);

    const descAfter = Object.getOwnPropertyDescriptor(document, 'hidden');
    if (!descAfter || descAfter.configurable) {
      Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    }
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
      jest.advanceTimersByTime(1000);
    });
    expect(fn).toHaveBeenCalledTimes(2);

    if (original) Object.defineProperty(document, 'hidden', original);
  });

  it('restarts interval when delay changes and removes listener on unmount', () => {
    const fn = jest.fn();
    const removeSpy = jest.spyOn(document, 'removeEventListener');

    const { rerender, unmount } = renderHook(({ cb, opts }) => useAutoplay(cb, opts), {
      initialProps: { cb: fn, opts: { delay: 300 } },
    });

    act(() => jest.advanceTimersByTime(300));
    expect(fn).toHaveBeenCalledTimes(1);

    rerender({ cb: fn, opts: { delay: 600 } });
    act(() => jest.advanceTimersByTime(600));
    expect(fn).toHaveBeenCalledTimes(2);

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
  });
});

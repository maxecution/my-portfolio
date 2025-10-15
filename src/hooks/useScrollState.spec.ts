import { renderHook, act } from '@testing-library/react';
import useScrollState from './useScrollState';

// Mock window.scrollY since jsdom doesn't implement it
const mockScrollY = (value: number): void => {
  Object.defineProperty(window, 'scrollY', {
    writable: true,
    configurable: true,
    value,
  });
};

// Helper function to trigger scroll event
const triggerScrollEvent = (): void => {
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
};

describe('useScrollState', () => {
  let originalScrollY: PropertyDescriptor | undefined;

  beforeEach(() => {
    // Store original scrollY descriptor
    originalScrollY = Object.getOwnPropertyDescriptor(window, 'scrollY');

    // Reset scroll position
    mockScrollY(0);

    // Clear any existing event listeners
    window.removeEventListener('scroll', jest.fn());
  });

  afterEach(() => {
    // Restore original scrollY if it existed
    if (originalScrollY) {
      Object.defineProperty(window, 'scrollY', originalScrollY);
    } else {
      // Reset to undefined if no original descriptor existed
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: undefined,
      });
    }
  });

  describe('default behavior with threshold = 10', () => {
    it('should progress from false to true as scroll position increases through threshold', () => {
      const { result } = renderHook(() => useScrollState());

      // Start at scroll position 0 - should be false
      mockScrollY(0);
      triggerScrollEvent();
      expect(result.current).toBe(false);

      // Below threshold at 5 - should still be false
      mockScrollY(5);
      triggerScrollEvent();
      expect(result.current).toBe(false);

      // At threshold (10) - should still be false (not greater than)
      mockScrollY(10);
      triggerScrollEvent();
      expect(result.current).toBe(false);

      // Above threshold at 15 - should now be true
      mockScrollY(15);
      triggerScrollEvent();
      expect(result.current).toBe(true);
    });
  });
  describe('custom threshold values', () => {
    it('should work with custom threshold of 0', () => {
      const { result } = renderHook(() => useScrollState(0));

      // Should be false initially (0 is not > 0)
      expect(result.current).toBe(false);

      // Should be true when scrolled any amount
      mockScrollY(1);
      triggerScrollEvent();
      expect(result.current).toBe(true);
    });

    it('should work with custom threshold of 50', () => {
      const { result } = renderHook(() => useScrollState(50));

      expect(result.current).toBe(false);

      mockScrollY(25);
      triggerScrollEvent();
      expect(result.current).toBe(false);

      mockScrollY(75);
      triggerScrollEvent();
      expect(result.current).toBe(true);
    });

    it('should work with large threshold values', () => {
      const { result } = renderHook(() => useScrollState(1000));

      mockScrollY(999);
      triggerScrollEvent();
      expect(result.current).toBe(false);

      mockScrollY(1001);
      triggerScrollEvent();
      expect(result.current).toBe(true);
    });
  });

  describe('scroll event handling', () => {
    it('should update state when scroll events are triggered', () => {
      const { result } = renderHook(() => useScrollState(20));

      expect(result.current).toBe(false);

      // Scroll above threshold
      mockScrollY(25);
      triggerScrollEvent();
      expect(result.current).toBe(true);

      // Scroll back below threshold
      mockScrollY(15);
      triggerScrollEvent();
      expect(result.current).toBe(false);
    });

    it('should handle multiple scroll events correctly', () => {
      const { result } = renderHook(() => useScrollState(10));

      // Multiple scrolls above threshold
      mockScrollY(20);
      triggerScrollEvent();
      expect(result.current).toBe(true);

      mockScrollY(30);
      triggerScrollEvent();
      expect(result.current).toBe(true);

      mockScrollY(5);
      triggerScrollEvent();
      expect(result.current).toBe(false);
    });

    it('should use passive event listener for performance', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

      renderHook(() => useScrollState());

      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });

      addEventListenerSpy.mockRestore();
    });
  });

  describe('cleanup and memory management', () => {
    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useScrollState());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    it('should not cause memory leaks with multiple instances', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount: unmount1 } = renderHook(() => useScrollState(10));
      const { unmount: unmount2 } = renderHook(() => useScrollState(20));
      const { unmount: unmount3 } = renderHook(() => useScrollState(30));

      expect(addEventListenerSpy).toHaveBeenCalledTimes(3);

      unmount1();
      unmount2();
      unmount3();

      expect(removeEventListenerSpy).toHaveBeenCalledTimes(3);

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('edge cases', () => {
    it('should handle negative threshold values', () => {
      const { result } = renderHook(() => useScrollState(-10));

      // Any positive scroll should be greater than negative threshold
      mockScrollY(1);
      triggerScrollEvent();
      expect(result.current).toBe(true);

      // Even 0 should be greater than negative threshold
      mockScrollY(0);
      triggerScrollEvent();
      expect(result.current).toBe(true);
    });

    it('should handle decimal threshold values', () => {
      const { result } = renderHook(() => useScrollState(10.5));

      mockScrollY(10);
      triggerScrollEvent();
      expect(result.current).toBe(false);

      mockScrollY(11);
      triggerScrollEvent();
      expect(result.current).toBe(true);
    });

    it('should call handleScroll immediately on mount to set initial state', () => {
      // Start with scroll position above threshold
      mockScrollY(50);

      const { result } = renderHook(() => useScrollState(10));

      // Should immediately return true without needing a scroll event
      expect(result.current).toBe(true);
    });
  });
});

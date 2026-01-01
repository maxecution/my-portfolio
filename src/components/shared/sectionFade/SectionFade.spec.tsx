import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SectionFade from './SectionFade';

describe('SectionFade Component', () => {
  const listeners: Record<string, ((e: MediaQueryListEvent) => void)[]> = {};
  let mockIntersectionObserver: jest.Mock;
  let observeCallback: IntersectionObserverCallback;
  const TEST_CONTENT = 'Test Content';

  function dispatchChange(matches: boolean) {
    (listeners['change'] ?? []).forEach((cb) => cb({ matches } as MediaQueryListEvent));
  }

  beforeEach(() => {
    mockIntersectionObserver = jest.fn(function (callback: IntersectionObserverCallback) {
      observeCallback = callback;
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
        takeRecords: jest.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
      };
    });
    window.IntersectionObserver = mockIntersectionObserver;

    // Reset listeners
    for (const key in listeners) delete listeners[key];

    // Mock matchMedia for useIsMobile
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: (event: string, cb: (e: MediaQueryListEvent) => void) => {
          if (!listeners[event]) listeners[event] = [];
          listeners[event].push(cb);
        },
        removeEventListener: (event: string, cb: (e: MediaQueryListEvent) => void) => {
          listeners[event] = listeners[event]?.filter((x) => x !== cb) ?? [];
        },
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should apply default fade classes when not visible', () => {
    const { container } = render(<SectionFade>{TEST_CONTENT}</SectionFade>);
    const fadeElement = container.firstChild as HTMLElement;

    expect(fadeElement).toHaveClass('transition-all', 'duration-700', 'ease-out', 'opacity-0', 'translate-y-5');
  });

  test('should apply visible classes when intersecting', () => {
    const { container, rerender } = render(<SectionFade>{TEST_CONTENT}</SectionFade>);
    const fadeElement = container.firstChild as HTMLElement;

    act(() => {
      observeCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    rerender(<SectionFade>{TEST_CONTENT}</SectionFade>);

    expect(fadeElement).toHaveClass('opacity-100', 'translate-y-0');
  });

  test('should set transition delay when visible', () => {
    const { container, rerender } = render(<SectionFade delay={0.5}>{TEST_CONTENT}</SectionFade>);
    const fadeElement = container.firstChild as HTMLElement;

    expect(fadeElement).toHaveStyle({ transitionDelay: '0s' });

    act(() => {
      observeCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    rerender(<SectionFade delay={0.5}>{TEST_CONTENT}</SectionFade>);

    expect(fadeElement).toHaveStyle({ transitionDelay: '0.5s' });
  });

  test('should merge custom className', () => {
    const { container } = render(<SectionFade className='custom-class mb-4'>{TEST_CONTENT}</SectionFade>);
    const fadeElement = container.firstChild as HTMLElement;

    expect(fadeElement).toHaveClass('transition-all', 'custom-class', 'mb-4');
  });

  test('should use default delay of 0 when not provided', () => {
    const { container, rerender } = render(<SectionFade>{TEST_CONTENT}</SectionFade>);
    const fadeElement = container.firstChild as HTMLElement;

    act(() => {
      observeCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    rerender(<SectionFade>{TEST_CONTENT}</SectionFade>);

    expect(fadeElement).toHaveStyle({ transitionDelay: '0s' });
  });

  test('should respect fade out when fadeOut=true and !isMobile', () => {
    const { container, rerender } = render(<SectionFade fadeOut={true}>{TEST_CONTENT}</SectionFade>);
    const fadeElement = container.firstChild as HTMLElement;

    // Initially not visible
    expect(fadeElement).toHaveClass('opacity-0');

    //  After intersection, element becomes visible
    act(() => {
      observeCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    rerender(<SectionFade fadeOut={true}>{TEST_CONTENT}</SectionFade>);
    expect(fadeElement).toHaveClass('opacity-100');

    // Simulate exiting viewport and isMobile = false
    act(() => dispatchChange(false));
    act(() => {
      observeCallback([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    rerender(<SectionFade fadeOut={true}>{TEST_CONTENT}</SectionFade>);

    // Should fade out (setVisible = false after !isMobile check)
    expect(fadeElement).toHaveClass('opacity-0');
  });

  test('should not fade out/remain visible when fadeOut=true and isMobile', () => {
    const { container, rerender } = render(<SectionFade fadeOut={true}>{TEST_CONTENT}</SectionFade>);
    const fadeElement = container.firstChild as HTMLElement;

    // Initially not visible
    expect(fadeElement).toHaveClass('opacity-0');

    // After intersection, element becomes visible
    act(() => {
      observeCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    rerender(<SectionFade fadeOut={true}>{TEST_CONTENT}</SectionFade>);
    expect(fadeElement).toHaveClass('opacity-100');

    // Simulate exiting viewport and isMobile = true
    act(() => dispatchChange(true));
    act(() => {
      observeCallback([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    rerender(<SectionFade fadeOut={true}>{TEST_CONTENT}</SectionFade>);

    // Should remain visible (isVisible is not set back to false)
    expect(fadeElement).toHaveClass('opacity-100');
  });

  test('should setup and cleanup IntersectionObserver', () => {
    const observeMock = jest.fn();
    const disconnectMock = jest.fn();

    mockIntersectionObserver.mockReturnValue({
      observe: observeMock,
      disconnect: disconnectMock,
      unobserve: jest.fn(),
      takeRecords: jest.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
    });

    const { unmount } = render(<SectionFade>{TEST_CONTENT}</SectionFade>);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), { threshold: 0.3 });
    expect(observeMock).toHaveBeenCalled();

    unmount();
    expect(disconnectMock).toHaveBeenCalled();
  });

  test('should handle complex children', () => {
    render(
      <SectionFade>
        <h2>Title</h2>
        <p>Description text</p>
      </SectionFade>
    );

    expect(screen.getByText('Title')).toBeVisible();
    expect(screen.getByText('Description text')).toBeVisible();
  });
});

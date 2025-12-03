import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SectionFade from './SectionFade';

describe('SectionFade Component', () => {
  let mockIntersectionObserver: jest.Mock;
  let observeCallback: IntersectionObserverCallback;
  const TEST_CONTENT = 'Test Content';

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render children correctly', () => {
    render(<SectionFade>{TEST_CONTENT}</SectionFade>);

    expect(screen.getByText(TEST_CONTENT)).toBeVisible();
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

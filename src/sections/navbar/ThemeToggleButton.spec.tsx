import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggleButton from './ThemeToggleButton';
import { useTheme } from '@contexts/ThemeProvider/useTheme';

// Mock the useTheme hook
jest.mock('@contexts/ThemeProvider/useTheme');
const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

// Mock document.startViewTransition
const mockStartViewTransition = jest.fn();

// Mock window.matchMedia
const createMockMatchMedia = (matches: boolean) =>
  jest.fn(() => ({
    matches,
  }));

// Helper function to set startViewTransition mock
const setViewTransitionMock = (mockFn: jest.MockedFunction<() => void>) => {
  (document as unknown as Record<string, unknown>).startViewTransition = mockFn;
};

describe('ThemeToggleButton', () => {
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Remove document.startViewTransition so it is undefined by default
    delete (document as unknown as Record<string, unknown>).startViewTransition;

    // Mock useTheme to return mock toggle function
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
      toggleTheme: mockToggleTheme,
      actualTheme: 'dark',
    });

    // Reset window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: createMockMatchMedia(false),
    });

    // Clear any existing style elements from previous tests
    const existingStyles = document.head.querySelectorAll('style[id^="theme-transition-"]');
    existingStyles.forEach((style) => style.remove());
  });

  describe('rendering', () => {
    it('should render button with correct accessibility attributes', () => {
      render(<ThemeToggleButton />);

      const button = screen.getByRole('button', { name: 'Theme toggle button' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('title', 'Theme toggle button');
      expect(button).toHaveAttribute('aria-label', 'Theme toggle button');
    });

    it('should render with theme icons', () => {
      render(<ThemeToggleButton />);

      // Should have icons for both light and dark themes
      expect(screen.getByRole('button').querySelectorAll('svg')).toHaveLength(2);
    });
  });

  describe('click handling without view transitions', () => {
    it('should call toggleTheme when view transitions are not supported', () => {
      // document.startViewTransition is undefined by default in beforeEach
      render(<ThemeToggleButton />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
      expect(mockStartViewTransition).not.toHaveBeenCalled();
    });

    it('should call toggleTheme when user prefers reduced motion', () => {
      // Mock prefers-reduced-motion: reduce
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: createMockMatchMedia(true),
      });

      // Mock view transition support
      setViewTransitionMock(mockStartViewTransition);

      render(<ThemeToggleButton />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
      expect(mockStartViewTransition).not.toHaveBeenCalled();
    });
  });

  describe('click handling with view transitions', () => {
    beforeEach(() => {
      // Mock view transition support
      setViewTransitionMock(mockStartViewTransition);

      // Mock successful view transition
      mockStartViewTransition.mockImplementation((callback: () => void) => {
        callback();
        return Promise.resolve();
      });

      // Ensure user does not prefer reduced motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: createMockMatchMedia(false),
      });
    });

    it('should use view transition when supported and motion is not reduced', () => {
      render(<ThemeToggleButton />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockStartViewTransition).toHaveBeenCalledTimes(1);
      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it('should add and remove transition styles when using view transitions', () => {
      render(<ThemeToggleButton />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      // Check that style element was added
      const styleElements = document.head.querySelectorAll('style[id^="theme-transition-"]');
      expect(styleElements).toHaveLength(1);

      const styleElement = styleElements[0] as HTMLStyleElement;
      expect(styleElement.textContent).toContain('::view-transition-old(root)');
      expect(styleElement.textContent).toContain('::view-transition-new(root)');
      expect(styleElement.textContent).toContain('circle-expand');
      expect(styleElement.textContent).toContain('clip-path: circle(0% at 100% 0%)');
      expect(styleElement.textContent).toContain('clip-path: circle(150% at 100% 0%)');

      // Fast-forward time to trigger style removal
      jest.advanceTimersByTime(2500);

      // Check that style element was removed
      expect(document.head.querySelectorAll('style[id^="theme-transition-"]')).toHaveLength(0);
    });
    it('should handle multiple rapid clicks gracefully, and clean up styles after timeout', () => {
      setViewTransitionMock(mockStartViewTransition);
      mockStartViewTransition.mockImplementation((callback: () => void) => {
        callback();
        return Promise.resolve();
      });

      render(<ThemeToggleButton />);

      const button = screen.getByRole('button');

      // Rapid clicks
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockToggleTheme).toHaveBeenCalledTimes(3);
      expect(mockStartViewTransition).toHaveBeenCalledTimes(3);

      // Should have 3 style elements
      expect(document.head.querySelectorAll('style[id^="theme-transition-"]')).toHaveLength(3);

      jest.advanceTimersByTime(2500);

      // All styles should be cleaned up
      expect(document.head.querySelectorAll('style[id^="theme-transition-"]')).toHaveLength(0);
    });
  });
});

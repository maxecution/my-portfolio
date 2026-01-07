import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './useTheme';
import {
  THEME_TEST_CONSTANTS,
  getCurrentThemeText,
  getResolvedThemeText,
  setupThemeTestEnvironment,
  createMatchMediaMock,
  type LocalStorageMock,
} from './themeProviderTestUtils';

// Destructure constants for easier use
const { LIGHT, DARK, SYSTEM, SET_LIGHT, SET_DARK, SET_SYSTEM, TOGGLE, STORAGE_KEY } = THEME_TEST_CONSTANTS;

// Test component that uses the theme context for UI interaction
const TestComponent = () => {
  const { theme, setTheme, toggleTheme, actualTheme } = useTheme();

  return (
    <div data-testid='theme-container' className='bg-white text-black dark:bg-gray-900 dark:text-white'>
      <div data-testid='current-theme'>{getCurrentThemeText(theme)}</div>
      <div data-testid='resolved-theme'>{getResolvedThemeText(actualTheme)}</div>
      <div className='space-y-2'>
        <button className='px-4 py-2 bg-blue-500 text-white dark:bg-blue-700' onClick={() => setTheme('light')}>
          {SET_LIGHT}
        </button>
        <button className='px-4 py-2 bg-blue-500 text-white dark:bg-blue-700' onClick={() => setTheme('dark')}>
          {SET_DARK}
        </button>
        <button className='px-4 py-2 bg-blue-500 text-white dark:bg-blue-700' onClick={() => setTheme('system')}>
          {SET_SYSTEM}
        </button>
        <button className='px-4 py-2 bg-green-500 text-white dark:bg-green-700' onClick={toggleTheme}>
          {TOGGLE}
        </button>
      </div>
    </div>
  );
};

describe('ThemeProvider', () => {
  let localStorageMock: LocalStorageMock;
  let cleanup: () => void;

  beforeEach(() => {
    const testEnv = setupThemeTestEnvironment();
    localStorageMock = testEnv.mockLocalStorage;
    cleanup = testEnv.cleanup;
  });

  afterEach(() => {
    cleanup();
  });

  test('should render with correct initial state and handle theme switching with persistence', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Test TestComponent renders with initial UI state
    expect(screen.getByText(getCurrentThemeText(SYSTEM))).toBeVisible();
    expect(screen.getByText(getResolvedThemeText(DARK))).toBeVisible();

    // Test theme container has correct classes for Tailwind
    expect(screen.getByTestId('theme-container')).toHaveClass(
      'bg-white',
      'text-black',
      'dark:bg-gray-900',
      'dark:text-white'
    ); // Unable to test actual colours in JSDOM, so if tailwind classes are present,
    // and .dark/.light is applied to the document, we assume it's working correctly

    // Test theme buttons are visible and accessible
    expect(screen.getByText(SET_LIGHT)).toBeVisible();
    expect(screen.getByText(SET_DARK)).toBeVisible();
    expect(screen.getByText(SET_SYSTEM)).toBeVisible();
    expect(screen.getByText(TOGGLE)).toBeVisible();

    // Test initial theme application (dark from system mock)
    expect(document.documentElement).toHaveClass(DARK);
    expect(document.documentElement).not.toHaveClass(LIGHT);

    // Test theme switching functionality
    act(() => {
      screen.getByText(SET_LIGHT).click();
    });

    // Test localStorage persistence
    expect(localStorageMock.setItem).toHaveBeenCalledWith(STORAGE_KEY, LIGHT);

    // Test theme state and document changes
    expect(screen.getByText(getCurrentThemeText(LIGHT))).toBeVisible();
    expect(screen.getByText(getResolvedThemeText(LIGHT))).toBeVisible();
    expect(document.documentElement).toHaveClass(LIGHT);
    expect(document.documentElement).not.toHaveClass(DARK);
  });

  test('should toggle between themes when toggleTheme is used', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByText(TOGGLE);

    // Initial state should be dark (from system theme mock)
    expect(document.documentElement).toHaveClass(DARK);
    expect(screen.getByText(getResolvedThemeText(DARK))).toBeVisible();

    // First toggle: dark -> light
    act(() => {
      toggleButton.click();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(STORAGE_KEY, LIGHT);
    expect(screen.getByText(getCurrentThemeText(LIGHT))).toBeVisible();
    expect(screen.getByText(getResolvedThemeText(LIGHT))).toBeVisible();
    expect(document.documentElement).toHaveClass(LIGHT);

    // Second toggle: light -> dark
    act(() => {
      toggleButton.click();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(STORAGE_KEY, DARK);
    expect(screen.getByText(getCurrentThemeText(DARK))).toBeVisible();
    expect(screen.getByText(getResolvedThemeText(DARK))).toBeVisible();
    expect(document.documentElement).toHaveClass(DARK);
  });

  test('should handle system theme with initial light preference', () => {
    // Mock system preference to be light initially
    window.matchMedia = jest.fn().mockImplementation(
      () => createMatchMediaMock(false) // false = light theme
    );

    render(
      <ThemeProvider defaultTheme='system'>
        <TestComponent />
      </ThemeProvider>
    );

    // Should start with light theme when system preference is light
    expect(document.documentElement).toHaveClass(LIGHT);
    expect(document.documentElement).not.toHaveClass(DARK);
    expect(screen.getByText(getCurrentThemeText(SYSTEM))).toBeVisible();
    expect(screen.getByText(getResolvedThemeText(LIGHT))).toBeVisible();
  });

  test('should handle system theme change dynamically', () => {
    let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;

    const mockAddEventListener = jest.fn((event, handler) => {
      if (event === 'change') {
        changeHandler = handler;
      }
    });

    window.matchMedia = jest.fn().mockImplementation(() => ({
      ...createMatchMediaMock(),
      addEventListener: mockAddEventListener,
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains(DARK)).toBe(true);

    act(() => {
      if (changeHandler) {
        changeHandler({ matches: false } as MediaQueryListEvent);
      }
    });

    expect(document.documentElement.classList.contains(LIGHT)).toBe(true);

    act(() => {
      if (changeHandler) {
        changeHandler({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(document.documentElement.classList.contains(DARK)).toBe(true);
  });

  test('should load from localStorage, handle invalid values, and use custom storage key', () => {
    // Test valid localStorage value
    localStorageMock.clear();
    localStorageMock.getItem.mockReturnValue(DARK);

    let { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText(getCurrentThemeText(DARK))).toBeVisible();
    expect(screen.getByText(getResolvedThemeText(DARK))).toBeVisible();
    expect(document.documentElement).toHaveClass(DARK);

    // Unmount and clear for next test
    unmount();
    localStorageMock.clear();

    // Test invalid localStorage value handling
    localStorageMock.getItem.mockReturnValue('invalid');

    ({ unmount } = render(
      <ThemeProvider defaultTheme='light'>
        <TestComponent />
      </ThemeProvider>
    ));

    expect(screen.getByText(getCurrentThemeText(LIGHT))).toBeVisible();
    expect(screen.getByText(getResolvedThemeText(LIGHT))).toBeVisible();
    expect(document.documentElement).toHaveClass(LIGHT);

    // Unmount and clear for next test
    unmount();
    localStorageMock.clear();

    // Test custom storage key
    render(
      <ThemeProvider storageKey='custom-key'>
        <TestComponent />
      </ThemeProvider>
    );

    expect(localStorageMock.getItem).toHaveBeenCalledWith('custom-key');
  });
});

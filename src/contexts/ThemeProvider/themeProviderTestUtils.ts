/**
 * Shared mocks for theme-related testing
 * Used by ThemeProvider.spec.tsx and useTheme.spec.tsx
 */

// Test constants for string reusability across theme tests
export const THEME_TEST_CONSTANTS = {
  CURRENT: "Current theme: ",
  RESOLVED: "Resolved theme: ",
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
  SET_LIGHT: "Set Light Theme",
  SET_DARK: "Set Dark Theme",
  SET_SYSTEM: "Set System Theme",
  TOGGLE: "Toggle Theme",
  STORAGE_KEY: "portfolio-theme",
} as const;

// Helper functions for consistent text generation
export const getCurrentThemeText = (theme: string) => `${THEME_TEST_CONSTANTS.CURRENT}${theme}`;
export const getResolvedThemeText = (theme: string) => `${THEME_TEST_CONSTANTS.RESOLVED}${theme}`;

// Type for localStorage mock
export interface LocalStorageMock {
  getItem: jest.MockedFunction<(key: string) => string | null>;
  setItem: jest.MockedFunction<(key: string, value: string) => void>;
  clear: jest.MockedFunction<() => void>;
}

// Factory function to create localStorage mock
export const createLocalStorageMock = (): LocalStorageMock => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
};

// Type for matchMedia mock
export interface MatchMediaMock {
  matches: boolean;
  media: string;
  onchange: null;
  addEventListener: jest.MockedFunction<(event: string, handler: EventListener) => void>;
  removeEventListener: jest.MockedFunction<() => void>;
  dispatchEvent: jest.MockedFunction<() => void>;
  // Legacy methods for older browsers
  addListener?: jest.MockedFunction<() => void>;
  removeListener?: jest.MockedFunction<() => void>;
}

// Factory function to create matchMedia mock
export const createMatchMediaMock = (
  matches: boolean = true,
  query: string = "(prefers-color-scheme: dark)"
): MatchMediaMock => ({
  matches,
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

// Setup helper for common test environment
export const setupThemeTestEnvironment = () => {
  const mockLocalStorage = createLocalStorageMock();
  const originalLocalStorage = window.localStorage;
  const originalMatchMedia = window.matchMedia;

  // Setup localStorage mock
  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage,
    writable: true,
  });

  // Setup matchMedia mock (defaults to dark mode)
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => createMatchMediaMock(true, query)),
  });

  // Clear DOM classes
  document.documentElement.className = "";

  return {
    mockLocalStorage,
    cleanup: () => {
      window.localStorage = originalLocalStorage;
      window.matchMedia = originalMatchMedia;
      jest.clearAllMocks();
    },
  };
};

import { renderHook } from "@testing-library/react";
import { useTheme } from "./useTheme";
import { ThemeProvider } from "@contexts/ThemeProvider/ThemeProvider";
import React from "react";
import {
  createLocalStorageMock,
  createMatchMediaMock,
  type LocalStorageMock,
} from "@contexts/ThemeProvider/themeProviderTestUtils";

describe("useTheme Hook", () => {
  let mockLocalStorage: LocalStorageMock;
  let originalLocalStorage: Storage;
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    // Setup localStorage mock
    mockLocalStorage = createLocalStorageMock();
    originalLocalStorage = window.localStorage;
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });

    // Setup matchMedia mock
    originalMatchMedia = window.matchMedia;
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      ...createMatchMediaMock(),
      media: query,
    }));
  });

  afterEach(() => {
    // Restore original implementations
    window.localStorage = originalLocalStorage;
    window.matchMedia = originalMatchMedia;
    jest.clearAllMocks();
  });

  const createWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider defaultTheme='system'>{children}</ThemeProvider>
  );

  describe("Error Handling", () => {
    test("should throw error when used outside ThemeProvider", () => {
      // Test the scenario: using the hook without a ThemeProvider wrapper
      expect(() => {
        renderHook(() => useTheme()); // No wrapper = null context = error
      }).toThrow("useTheme must be used within a ThemeProvider");
    });
  });

  describe("Successful Usage", () => {
    test("should return complete theme context with correct properties and values", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper,
      });

      expect(result.current.theme).toBe("system");
      // actualTheme resolves to dark or light depending on system setting
      expect(["dark", "light"]).toContain(result.current.actualTheme);

      expect(result.current.setTheme).toBeDefined();
      expect(result.current.toggleTheme).toBeDefined();
    });
  });
});

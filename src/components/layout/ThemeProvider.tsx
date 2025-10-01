/**
 * ThemeProvider - Manages theme state with system detection, persistence, manual setting and toggle functionality
 */

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ThemeProviderContext, type Theme, type ThemeProviderState } from "@/contexts/ThemeContext";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "portfolio-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey) as Theme;
      if (stored && ["dark", "light", "system"].includes(stored)) {
        return stored;
      }
    }
    return defaultTheme;
  });

  const [actualTheme, setActualTheme] = useState<"dark" | "light">("dark");

  // Apply theme to DOM, resolve "system" preference, and set up system change listener
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let resolvedTheme: "dark" | "light";

    if (theme === "system") {
      // Check system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      resolvedTheme = systemTheme;

      // Set up listener for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = (e: MediaQueryListEvent) => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        const newTheme = e.matches ? "dark" : "light";
        root.classList.add(newTheme);
        setActualTheme(newTheme);
      };

      mediaQuery.addEventListener("change", handleChange);

      // Apply current system theme
      root.classList.add(resolvedTheme);
      setActualTheme(resolvedTheme);

      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      resolvedTheme = theme;
      root.classList.add(resolvedTheme);
      setActualTheme(resolvedTheme);
    }
  }, [theme]);

  /**
   * Handler: Toggle between light and dark themes
   * Note: This ignores "system" preference and switches directly between light/dark
   * Uses the actualTheme (resolved theme) to determine what to toggle to
   */
  const toggleTheme = () => {
    const newTheme = actualTheme === "dark" ? "light" : "dark";
    handleSetTheme(newTheme);
  };

  const handleSetTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setTheme(newTheme);
  };

  const value: ThemeProviderState = {
    theme,
    setTheme: handleSetTheme,
    toggleTheme,
    actualTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

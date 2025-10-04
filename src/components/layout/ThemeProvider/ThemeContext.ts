import { createContext } from "react";

export type Theme = "dark" | "light" | "system";

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  actualTheme: "dark" | "light";
};

// Standard React pattern: use null as default to force explicit provider usage
export const ThemeProviderContext = createContext<ThemeProviderState | null>(null);

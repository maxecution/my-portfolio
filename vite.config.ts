import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      //also update in tsconfig.json, tsconfig.app.json, jest.config.js!
      "@": "/src",
      "@layout": "/src/components/layout",
    },
  },
});

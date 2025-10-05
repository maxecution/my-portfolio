/** @type {import("jest").Config} **/
export default {
  testEnvironment: "jsdom",
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          lib: ["es2017", "dom", "dom.iterable"],
          target: "es2017",
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@layout/(.*)$": "<rootDir>/src/components/layout/$1",
    // Handle CSS imports in tests
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Handle static assets
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "jest-transform-stub",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
    "!src/App.tsx", // Exclude main App component from coverage requirements for now until more components are added
    "!src/setupTests.ts",
  ],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{ts,tsx}",
  ],
  // Performance and behavior optimizations
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 10000,
  maxWorkers: "50%",
  // Better error reporting
  verbose: true,
  errorOnDeprecated: true,
  // Coverage thresholds to maintain quality
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  coverageReporters: ["text", "json", "json-summary", "lcov", "html"],
};

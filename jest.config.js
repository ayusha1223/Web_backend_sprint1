module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],

  moduleNameMapper: {
    "^uuid$": "<rootDir>/src/__tests__/__mocks__/uuid.js",
  },

  // ✅ ADD THIS PART
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.test.ts",
    "!src/**/__tests__/**",
    "!src/index.ts" // optional (entry file)
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
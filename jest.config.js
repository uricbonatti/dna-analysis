const base = { preset: 'ts-jest', testEnvironment: 'node' };

module.exports = {
  clearMocks: true,
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'lcov'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/app/server.ts',
    '!<rootDir>/src/config/*.ts',
    '!<rootDir>/src/interfaces/*.ts',
    '!<rootDir>/src/utils/logger.ts'
  ],
  projects: [
    { ...base, displayName: 'unit', testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'] },
    { ...base, displayName: 'e2e', testMatch: ['<rootDir>/tests/e2e/**/*.spec.ts'] }
  ]
};

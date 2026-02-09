module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '(/__tests__/|/test/|.spec\\.ts$)',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.module.ts',
    '!src/**/main.ts',
    '!src/**/*.spec.ts',
    '!src/**/dto/**',
    '!src/**/decorators/**',
    '!src/**/guards/**',
    '!src/**/strategies/**',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  coverageThreshold: {
    './src/auth/auth.service.ts': {
      branches: 80,
      functions: 100,
      lines: 96,
      statements: 96,
    },
    './src/vehicles/vehicles.service.ts': {
      branches: 45,
      functions: 81,
      lines: 62,
      statements: 64,
    },
    './src/bookings/bookings.service.ts': {
      branches: 47,
      functions: 100,
      lines: 84,
      statements: 85,
    },
    './src/health/health.service.ts': {
      branches: 77,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

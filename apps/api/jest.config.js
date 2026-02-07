module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.ts',
    '!**/main.ts',
    '!**/test/**',
    '!**/*.spec.ts',
    '!**/dto/**',
    '!**/decorators/**',
    '!**/guards/**',
    '!**/strategies/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
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

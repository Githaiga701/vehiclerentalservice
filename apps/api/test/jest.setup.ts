// Jest global setup for API tests
import 'jest-extended';

// Example: extend jest matchers if needed
// Setup environment variables for tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

// Additional global helpers can be attached to globalThis here
(globalThis as any).testTimeout = 20000;

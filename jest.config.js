module.exports = {
  preset: 'ts-jest', // Use ts-jest for TypeScript support
  testEnvironment: 'node', // Set the test environment to Node.js
  roots: ['<rootDir>'], // Specify the root directory for tests
  moduleFileExtensions: ['ts', 'tsx', 'js'], // Recognize these file extensions
  testMatch: ['**/tests/**/*.test.(ts|js)'], // Match test files
  collectCoverage: true, // Enable coverage collection
  coverageDirectory: 'coverage', // Output coverage reports to the 'coverage' directory
  coverageReporters: ['json-summary']
};

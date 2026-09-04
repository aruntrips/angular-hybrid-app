// packages/task-ui/jest.config.js
//
// See task-core/jest.config.js for why jest-preset-angular is needed.
// moduleNameMapper resolves the '@app/task-core' alias straight to
// that package's TS source - it's transformed on the fly by the same
// preset, so there's no separate build step task-core needs to run
// first just for task-ui's tests to see it.
module.exports = {
  displayName: 'task-ui',
  rootDir: '.',
  preset: 'jest-preset-angular',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    '^@app/task-core$': '<rootDir>/../task-core/src/index.ts'
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      { tsconfig: '<rootDir>/tsconfig.json' }
    ]
  }
};

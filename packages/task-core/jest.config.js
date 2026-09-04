// packages/task-core/jest.config.js
//
// jest-preset-angular handles two things plain ts-jest can't on its
// own: compiling Angular decorators the same way the real build does,
// and transforming @angular/core's ESM-only package (plain Jest
// ignores node_modules by default, but @angular/core ships .mjs files
// with `import` statements Node's CJS-based Jest runtime can't parse
// untransformed). No moduleNameMapper needed here - task-core is the
// leaf package, it doesn't import from anywhere else in the workspace.
module.exports = {
  displayName: 'task-core',
  rootDir: '.',
  preset: 'jest-preset-angular',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      { tsconfig: '<rootDir>/tsconfig.json' }
    ]
  }
};

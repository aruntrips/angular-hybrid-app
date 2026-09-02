// karma.conf.js
// Use this once you're ready to run tests headlessly in CI, via `npm test`.
//
// NOTE: as of Stage 3, spec/task.service.spec.ts is TypeScript and is
// NOT covered by this config yet - plain Karma only loads .js files.
// SpecRunner.html handles it today by loading webpack's compiled
// dist/spec-bundle.js. To bring it into this CI config too, add
// karma-webpack as a preprocessor for spec/**/*.ts, or point Karma at
// the same dist/spec-bundle.js output after `npm run build`.
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'js/app.js',
      'js/controllers/taskListController.js',
      'js/components/taskItem.component.js',
      'spec/taskListControllerSpec.js'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity
  });
};

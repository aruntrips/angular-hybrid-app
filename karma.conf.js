// karma.conf.js
// Use this once you're ready to run tests headlessly in CI, via `npm test`.
//
// As of Stage 5, TaskListController (and its taskListControllerSpec.js)
// are both gone - ported to TaskListComponent, tested by
// spec/task-list.component.spec.ts. Every remaining spec is
// TypeScript, so - rather than leave `files` empty (Karma exits 1 on
// 0 specs found, which would make `npm test` register as a CI
// failure) - this points straight at dist/spec-bundle.js, the same
// webpack output SpecRunner.html loads. Run `npm run build` first;
// this config doesn't compile spec/**/*.ts itself (that would need
// karma-webpack as a preprocessor).
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: ['dist/spec-bundle.js'],
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

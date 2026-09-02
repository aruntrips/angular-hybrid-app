// karma.conf.js
// Use this once you're ready to run tests headlessly in CI, via `npm test`.
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'js/app.js',
      'js/services/taskService.js',
      'js/controllers/taskListController.js',
      'js/components/taskItem.component.js',
      'spec/*.js'
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

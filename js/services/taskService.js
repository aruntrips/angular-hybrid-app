// services/taskService.js
//
// Pure data layer, no DOM/scope dependency. This is intentional:
// services with no $scope coupling are the *first* things you should
// port to TypeScript classes during a hybrid migration, since they
// can be used from both AngularJS (via $injector) and Angular (via DI)
// with a thin downgradeInjectable() wrapper.
angular.module('taskApp').factory('TaskService', function () {
  var tasks = [
    { id: 1, title: 'Set up hybrid build', done: false },
    { id: 2, title: 'Identify leaf components', done: false },
    { id: 3, title: 'Migrate TaskService to Angular', done: false },
    { id: 4, title: 'Downgrade TaskItem component', done: true }
  ];
  var nextId = 5;

  return {
    getAll: function () {
      return tasks;
    },
    add: function (title) {
      tasks.push({ id: nextId++, title: title, done: false });
    },
    remove: function (task) {
      var idx = tasks.indexOf(task);
      if (idx > -1) tasks.splice(idx, 1);
    },
    toggle: function (task) {
      task.done = !task.done;
    }
  };
});

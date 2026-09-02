// controllers/taskListController.js
//
// This controller has real logic (filtering, counts) beyond wiring —
// during migration this is a good candidate to convert into an Angular
// component class *after* TaskItem and TaskService are already ported,
// since it depends on both.
angular.module('taskApp').controller('TaskListController', ['TaskService',
  function (TaskService) {
    var vm = this;

    vm.filters = ['all', 'active', 'done'];
    vm.currentFilter = 'all';
    vm.newTaskTitle = '';

    vm.setFilter = function (f) {
      vm.currentFilter = f;
    };

    vm.filteredTasks = function () {
      var all = TaskService.getAll();
      if (vm.currentFilter === 'active') {
        return all.filter(function (t) { return !t.done; });
      }
      if (vm.currentFilter === 'done') {
        return all.filter(function (t) { return t.done; });
      }
      return all;
    };

    vm.remainingCount = function () {
      return TaskService.getAll().filter(function (t) { return !t.done; }).length;
    };

    vm.addTask = function () {
      if (!vm.newTaskTitle) return;
      TaskService.add(vm.newTaskTitle);
      vm.newTaskTitle = '';
    };

    vm.removeTask = function (task) {
      TaskService.remove(task);
    };

    vm.toggleTask = function (task) {
      TaskService.toggle(task);
    };
  }
]);

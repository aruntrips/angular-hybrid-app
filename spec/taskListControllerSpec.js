// spec/taskListControllerSpec.js
describe('TaskListController', function () {
  beforeEach(module('taskApp'));

  var $controller, TaskService, vm;

  beforeEach(inject(function (_$controller_, _TaskService_) {
    $controller = _$controller_;
    TaskService = _TaskService_;
    vm = $controller('TaskListController');
  }));

  it('defaults to the "all" filter', function () {
    expect(vm.currentFilter).toBe('all');
  });

  it('filteredTasks returns all tasks when filter is "all"', function () {
    expect(vm.filteredTasks().length).toBe(TaskService.getAll().length);
  });

  it('filteredTasks returns only active tasks when filter is "active"', function () {
    vm.setFilter('active');
    var result = vm.filteredTasks();
    expect(result.every(function (t) { return !t.done; })).toBe(true);
  });

  it('filteredTasks returns only done tasks when filter is "done"', function () {
    vm.setFilter('done');
    var result = vm.filteredTasks();
    expect(result.every(function (t) { return t.done; })).toBe(true);
  });

  it('addTask adds a task and clears the input field', function () {
    var before = TaskService.getAll().length;
    vm.newTaskTitle = 'Write tests';
    vm.addTask();
    expect(TaskService.getAll().length).toBe(before + 1);
    expect(vm.newTaskTitle).toBe('');
  });

  it('addTask does nothing when the title is empty', function () {
    var before = TaskService.getAll().length;
    vm.newTaskTitle = '';
    vm.addTask();
    expect(TaskService.getAll().length).toBe(before);
  });

  it('remainingCount counts only the not-done tasks', function () {
    var expected = TaskService.getAll().filter(function (t) { return !t.done; }).length;
    expect(vm.remainingCount()).toBe(expected);
  });
});

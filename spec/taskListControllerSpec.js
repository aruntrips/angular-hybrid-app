// spec/taskListControllerSpec.js
//
// Stubs TaskService with $provide.value instead of injecting the real
// one. This decouples the controller test from TaskService's
// implementation entirely — it no longer matters whether 'TaskService'
// resolves to the old plain AngularJS factory or (as of Stage 3) a
// downgraded Angular class. SpecRunner.html doesn't even need to load
// the Angular bundle for this spec to run.
describe('TaskListController', function () {
  var fakeTasks;
  var FakeTaskService;

  beforeEach(function () {
    fakeTasks = [
      { id: 1, title: 'Stubbed task one', done: false },
      { id: 2, title: 'Stubbed task two', done: true }
    ];

    FakeTaskService = {
      getAll: function () { return fakeTasks; },
      add: function (title) { fakeTasks.push({ id: 99, title: title, done: false }); },
      remove: function (task) {
        var idx = fakeTasks.indexOf(task);
        if (idx > -1) fakeTasks.splice(idx, 1);
      },
      toggle: function (task) { task.done = !task.done; }
    };
  });

  beforeEach(module('taskApp', function ($provide) {
    $provide.value('TaskService', FakeTaskService);
  }));

  var $controller, vm;

  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;
    vm = $controller('TaskListController');
  }));

  it('defaults to the "all" filter', function () {
    expect(vm.currentFilter).toBe('all');
  });

  it('filteredTasks returns all tasks when filter is "all"', function () {
    expect(vm.filteredTasks().length).toBe(fakeTasks.length);
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
    var before = fakeTasks.length;
    vm.newTaskTitle = 'Write tests';
    vm.addTask();
    expect(fakeTasks.length).toBe(before + 1);
    expect(vm.newTaskTitle).toBe('');
  });

  it('addTask does nothing when the title is empty', function () {
    var before = fakeTasks.length;
    vm.newTaskTitle = '';
    vm.addTask();
    expect(fakeTasks.length).toBe(before);
  });

  it('remainingCount counts only the not-done tasks', function () {
    var expected = fakeTasks.filter(function (t) { return !t.done; }).length;
    expect(vm.remainingCount()).toBe(expected);
  });
});

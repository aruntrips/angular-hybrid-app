// spec/taskServiceSpec.js
describe('TaskService', function () {
  beforeEach(module('taskApp'));

  var TaskService;
  beforeEach(inject(function (_TaskService_) {
    TaskService = _TaskService_;
  }));

  it('starts with the seeded tasks', function () {
    expect(TaskService.getAll().length).toBe(4);
  });

  it('adds a new task as not done', function () {
    var before = TaskService.getAll().length;
    TaskService.add('New task');
    var all = TaskService.getAll();
    expect(all.length).toBe(before + 1);
    expect(all[all.length - 1].title).toBe('New task');
    expect(all[all.length - 1].done).toBe(false);
  });

  it('removes a task', function () {
    var all = TaskService.getAll();
    var before = all.length;
    var target = all[0];
    TaskService.remove(target);
    expect(TaskService.getAll().length).toBe(before - 1);
    expect(TaskService.getAll().indexOf(target)).toBe(-1);
  });

  it('toggles a task done state', function () {
    var task = TaskService.getAll()[0];
    var original = task.done;
    TaskService.toggle(task);
    expect(task.done).toBe(!original);
  });
});

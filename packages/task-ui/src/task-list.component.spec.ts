// packages/task-ui/src/task-list.component.spec.ts
//
// Same approach as task-core's spec: TaskListComponent's logic
// doesn't touch its own template, so it's tested by direct
// instantiation - no TestBed needed, and (as of Stage 7) no browser
// either, just plain Jest. TaskService is stubbed and passed straight
// to the constructor, decoupling this test from task-core's real
// implementation entirely.
import { TaskListComponent } from './task-list.component';
import { Task, TaskService } from '@app/task-core';

describe('TaskListComponent', () => {
  let fakeTasks: Task[];
  let fakeTaskService: TaskService;
  let component: TaskListComponent;

  beforeEach(() => {
    fakeTasks = [
      { id: 1, title: 'Stubbed task one', done: false },
      { id: 2, title: 'Stubbed task two', done: true }
    ];

    fakeTaskService = {
      getAll: () => fakeTasks,
      add: (title: string) => {
        fakeTasks.push({ id: 99, title, done: false });
      },
      remove: (task: Task) => {
        const idx = fakeTasks.indexOf(task);
        if (idx > -1) fakeTasks.splice(idx, 1);
      },
      toggle: (task: Task) => {
        task.done = !task.done;
      }
    } as TaskService;

    component = new TaskListComponent(fakeTaskService);
  });

  it('defaults to the "all" filter', () => {
    expect(component.currentFilter).toBe('all');
  });

  it('filteredTasks returns all tasks when filter is "all"', () => {
    expect(component.filteredTasks().length).toBe(fakeTasks.length);
  });

  it('filteredTasks returns only active tasks when filter is "active"', () => {
    component.setFilter('active');
    const result = component.filteredTasks();
    expect(result.every((t) => !t.done)).toBe(true);
  });

  it('filteredTasks returns only done tasks when filter is "done"', () => {
    component.setFilter('done');
    const result = component.filteredTasks();
    expect(result.every((t) => t.done)).toBe(true);
  });

  it('addTask adds a task and clears the input field', () => {
    const before = fakeTasks.length;
    component.newTaskTitle = 'Write tests';
    component.addTask();
    expect(fakeTasks.length).toBe(before + 1);
    expect(component.newTaskTitle).toBe('');
  });

  it('addTask does nothing when the title is empty', () => {
    const before = fakeTasks.length;
    component.newTaskTitle = '';
    component.addTask();
    expect(fakeTasks.length).toBe(before);
  });

  it('remainingCount counts only the not-done tasks', () => {
    const expected = fakeTasks.filter((t) => !t.done).length;
    expect(component.remainingCount()).toBe(expected);
  });

  it('toggleTask delegates to TaskService.toggle', () => {
    const task = fakeTasks[0];
    const original = task.done;
    component.toggleTask(task);
    expect(task.done).toBe(!original);
  });

  it('removeTask delegates to TaskService.remove', () => {
    const before = fakeTasks.length;
    const target = fakeTasks[0];
    component.removeTask(target);
    expect(fakeTasks.length).toBe(before - 1);
    expect(fakeTasks.indexOf(target)).toBe(-1);
  });
});

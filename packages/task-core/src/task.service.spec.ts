// packages/task-core/src/task.service.spec.ts
//
// Replaces the old AngularJS-injection-based taskServiceSpec.js. Now
// that TaskService is a plain Angular class with no constructor
// dependencies, it doesn't need TestBed or any AngularJS scaffolding —
// just instantiate it and test it like any other TypeScript class.
// As of Stage 7, runs under plain Jest (Node), not a browser at all -
// this file never touches Angular's compiler/DI/DOM, so there was
// never a real reason it needed one.
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    service = new TaskService();
  });

  it('starts with the seeded tasks', () => {
    expect(service.getAll().length).toBe(4);
  });

  it('adds a new task as not done', () => {
    const before = service.getAll().length;
    service.add('New task');
    const all = service.getAll();
    expect(all.length).toBe(before + 1);
    expect(all[all.length - 1].title).toBe('New task');
    expect(all[all.length - 1].done).toBe(false);
  });

  it('removes a task', () => {
    const all = service.getAll();
    const before = all.length;
    const target = all[0];
    service.remove(target);
    expect(service.getAll().length).toBe(before - 1);
    expect(service.getAll().indexOf(target)).toBe(-1);
  });

  it('toggles a task done state', () => {
    const task = service.getAll()[0];
    const original = task.done;
    service.toggle(task);
    expect(task.done).toBe(!original);
  });
});

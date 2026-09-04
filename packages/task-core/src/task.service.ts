// packages/task-core/src/task.service.ts
//
// The task-core package: the one file with zero AngularJS coupling
// since Stage 3 (no DOM, no $scope, not even a constructor
// dependency) - which is exactly why it's the cleanest first package
// boundary for Stage 7's monorepo split. Consumed by
// packages/task-ui's TaskListComponent via the '@app/task-core' alias.
import { Injectable } from '@angular/core';

export interface Task {
  id: number;
  title: string;
  done: boolean;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = [
    { id: 1, title: 'Set up hybrid build', done: false },
    { id: 2, title: 'Identify leaf components', done: false },
    { id: 3, title: 'Migrate TaskService to Angular', done: false },
    { id: 4, title: 'Downgrade TaskItem component', done: true }
  ];
  private nextId = 5;

  getAll(): Task[] {
    return this.tasks;
  }

  add(title: string): void {
    this.tasks.push({ id: this.nextId++, title, done: false });
  }

  remove(task: Task): void {
    const idx = this.tasks.indexOf(task);
    if (idx > -1) this.tasks.splice(idx, 1);
  }

  toggle(task: Task): void {
    task.done = !task.done;
  }
}

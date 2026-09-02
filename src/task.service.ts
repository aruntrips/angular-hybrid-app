// src/task.service.ts
//
// Angular-native replacement for js/services/taskService.js. Same
// public shape (getAll/add/remove/toggle) and same seed data, on
// purpose — TaskListController (still AngularJS) must keep working
// completely unchanged, consuming this through the downgraded
// factory registered in app.module.ts.
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

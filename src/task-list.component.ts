// src/task-list.component.ts
//
// Angular-native replacement for js/controllers/taskListController.js.
// As of Stage 6, bootstrapped directly (no downgradeComponent() - see
// app.module.ts) as this app's root component.
import { Component } from '@angular/core';
import { Task, TaskService } from './task.service';

type Filter = 'all' | 'active' | 'done';

@Component({
  selector: 'task-list',
  template: `
    <div class="app-shell">
      <header>
        <h1>Task Manager</h1>
        <p class="subtitle">Migrated from AngularJS to Angular, one stage at a time</p>
      </header>

      <section class="add-task">
        <input
          type="text"
          [value]="newTaskTitle"
          placeholder="Add a new task..."
          (input)="newTaskTitle = $event.target.value"
          (keyup.enter)="addTask()"
        />
        <button (click)="addTask()" [disabled]="!newTaskTitle">Add</button>
      </section>

      <section class="filters">
        <button
          *ngFor="let f of filters"
          (click)="setFilter(f)"
          [class.active]="currentFilter === f"
        >
          {{ f }}
        </button>
      </section>

      <section class="task-list">
        <task-item
          *ngFor="let task of filteredTasks()"
          [task]="task"
          (toggle)="toggleTask(task)"
          (remove)="removeTask(task)"
        ></task-item>

        <p class="empty-state" *ngIf="filteredTasks().length === 0">
          No tasks match this filter.
        </p>
      </section>

      <footer>
        <span>{{ remainingCount() }} remaining</span>
      </footer>
    </div>
  `
})
export class TaskListComponent {
  filters: Filter[] = ['all', 'active', 'done'];
  currentFilter: Filter = 'all';
  newTaskTitle = '';

  constructor(private taskService: TaskService) {}

  setFilter(f: Filter): void {
    this.currentFilter = f;
  }

  filteredTasks(): Task[] {
    const all = this.taskService.getAll();
    if (this.currentFilter === 'active') {
      return all.filter((t) => !t.done);
    }
    if (this.currentFilter === 'done') {
      return all.filter((t) => t.done);
    }
    return all;
  }

  remainingCount(): number {
    return this.taskService.getAll().filter((t) => !t.done).length;
  }

  addTask(): void {
    if (!this.newTaskTitle) return;
    this.taskService.add(this.newTaskTitle);
    this.newTaskTitle = '';
  }

  removeTask(task: Task): void {
    this.taskService.remove(task);
  }

  toggleTask(task: Task): void {
    this.taskService.toggle(task);
  }
}

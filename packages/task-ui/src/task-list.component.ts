// packages/task-ui/src/task-list.component.ts
//
// Part of the task-ui package (Stage 7), which depends on task-core
// for Task/TaskService (via the '@app/task-core' alias) - the same
// dependency direction the migration itself established back in
// Stages 3-5. Bootstrapped directly by apps/task-manager as the app's
// root component (see that app's app.module.ts).
import { Component } from '@angular/core';
import { Task, TaskService } from '@app/task-core';

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

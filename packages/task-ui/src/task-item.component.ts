// packages/task-ui/src/task-item.component.ts
//
// Part of the task-ui package (Stage 7). Historical note from when
// this was downgraded to AngularJS (Stages 4-6, since removed):
// downgradeComponent() only treated an attribute as an expression
// binding when written with Angular's own [input]/(output) syntax
// (or bind-input/on-output) - a plain input="expr" attribute was read
// as a literal string instead. Outputs are named toggle/remove, not
// onToggle/onRemove, to match plain Angular convention (no "on"
// prefix - that's for the template event-binding side).
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '@app/task-core';

@Component({
  selector: 'task-item',
  template: `
    <div class="task-item" [class.done]="task.done">
      <input type="checkbox" [checked]="task.done" (click)="toggle.emit()" />
      <span class="title">{{ task.title }}</span>
      <button class="remove" (click)="remove.emit()">&times;</button>
    </div>
  `
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() toggle = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
}

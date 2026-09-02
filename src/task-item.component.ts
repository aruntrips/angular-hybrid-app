// src/task-item.component.ts
//
// Angular-native replacement for js/components/taskItem.component.js.
// downgradeComponent() only treats an attribute as an expression
// binding when it's written with Angular's own [input]/(output)
// syntax (or bind-input/on-output) - a plain input="expr" attribute
// is read as a literal string, not evaluated. So index.html's
// <task-item> markup DOES change here, to [task]/(toggle)/(remove) -
// unlike Stage 3's downgradeInjectable, this isn't a drop-in swap.
// Outputs are also not auto-prefixed with "on" the way the old
// AngularJS '&' bindings were, so these are named toggle/remove
// (not onToggle/onRemove) to match Angular convention.
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from './task.service';

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

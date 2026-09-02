// src/app.module.ts
//
// This is the seam between the two frameworks. Stage 5 adds the last
// downgraded piece: taskList (formerly TaskListController). Its
// template uses *ngFor/*ngIf, which need CommonModule - the first
// time this app needs it, since task-item.component.ts's template
// doesn't use any structural directives.
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {
  UpgradeModule,
  downgradeInjectable,
  downgradeComponent
} from '@angular/upgrade/static';
import { TaskService } from './task.service';
import { TaskItemComponent } from './task-item.component';
import { TaskListComponent } from './task-list.component';

declare const angular: angular.IAngularStatic;

// Runs at module-load time (before bootstrap), so the AngularJS
// 'taskApp' module has these providers/directives queued and ready
// before AppModule.ngDoBootstrap() below asks AngularJS to bootstrap.
angular.module('taskApp').factory('TaskService', downgradeInjectable(TaskService));
angular.module('taskApp').directive('taskItem', downgradeComponent({ component: TaskItemComponent }));
angular.module('taskApp').directive('taskList', downgradeComponent({ component: TaskListComponent }));

@NgModule({
  declarations: [TaskItemComponent, TaskListComponent],
  imports: [BrowserModule, CommonModule, UpgradeModule]
  // No `bootstrap: [...]` array here on purpose — ngDoBootstrap below
  // takes over that responsibility so we can hand control to AngularJS
  // instead of an Angular root component (which doesn't exist yet).
})
export class AppModule {
  constructor(private upgrade: UpgradeModule) {}

  ngDoBootstrap(): void {
    // Equivalent to the old `ng-app="taskApp"` auto-bootstrap, just
    // triggered manually so Angular's platform is in control of the
    // page instead of AngularJS.
    this.upgrade.bootstrap(document.body, ['taskApp']);
  }
}

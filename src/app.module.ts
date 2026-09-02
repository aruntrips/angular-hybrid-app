// src/app.module.ts
//
// This is the seam between the two frameworks. Stage 4 adds the first
// downgraded component: taskItem. Angular now renders that leaf node;
// AngularJS's <task-item> markup in index.html is unchanged - it's
// backed by downgradeComponent() instead of .component().
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  UpgradeModule,
  downgradeInjectable,
  downgradeComponent
} from '@angular/upgrade/static';
import { TaskService } from './task.service';
import { TaskItemComponent } from './task-item.component';

declare const angular: angular.IAngularStatic;

// Runs at module-load time (before bootstrap), so the AngularJS
// 'taskApp' module has these providers/directives queued and ready
// before AppModule.ngDoBootstrap() below asks AngularJS to bootstrap.
angular.module('taskApp').factory('TaskService', downgradeInjectable(TaskService));
angular.module('taskApp').directive('taskItem', downgradeComponent({ component: TaskItemComponent }));

@NgModule({
  declarations: [TaskItemComponent],
  imports: [BrowserModule, UpgradeModule]
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

// src/app.module.ts
//
// This is the seam between the two frameworks. Stage 3 adds the first
// downgraded piece: TaskService. TaskListController (still AngularJS)
// keeps injecting 'TaskService' by name exactly as before — it has no
// idea the implementation moved to Angular.
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule, downgradeInjectable } from '@angular/upgrade/static';
import { TaskService } from './task.service';

declare const angular: angular.IAngularStatic;

// Runs at module-load time (before bootstrap), so the AngularJS
// 'taskApp' module has this provider queued and ready before
// AppModule.ngDoBootstrap() below asks AngularJS to bootstrap.
angular.module('taskApp').factory('TaskService', downgradeInjectable(TaskService));

@NgModule({
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

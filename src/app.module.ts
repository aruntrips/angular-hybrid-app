// src/app.module.ts
//
// This is the seam between the two frameworks. At this stage it does
// not declare or downgrade any components yet — that starts in Stage 3
// (TaskService) and Stage 4 (taskItem). Right now its only job is to
// prove Angular can bootstrap AngularJS's existing 'taskApp' module
// with zero behavior change.
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';

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

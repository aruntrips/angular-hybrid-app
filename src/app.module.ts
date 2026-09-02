// src/app.module.ts
//
// Stage 6: ngUpgrade is gone. No more UpgradeModule, no more
// downgradeComponent()/downgradeInjectable(), no more angular.module()
// calls reaching into AngularJS. This is a plain Angular NgModule that
// bootstraps TaskListComponent directly onto the <task-list> element
// in index.html - the same way any ordinary Angular app boots.
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from './task-item.component';
import { TaskListComponent } from './task-list.component';

@NgModule({
  declarations: [TaskItemComponent, TaskListComponent],
  imports: [BrowserModule, CommonModule],
  bootstrap: [TaskListComponent]
})
export class AppModule {}

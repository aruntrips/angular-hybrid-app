// apps/task-manager/src/app.module.ts
//
// The app shell (Stage 7): the only deployable unit in the workspace.
// Depends on task-ui (which in turn depends on task-core) - a plain
// Angular NgModule that bootstraps TaskListComponent directly onto
// the <task-list> element in index.html, the same way any ordinary
// Angular app boots.
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TaskItemComponent, TaskListComponent } from '@app/task-ui';

@NgModule({
  declarations: [TaskItemComponent, TaskListComponent],
  imports: [BrowserModule, CommonModule],
  bootstrap: [TaskListComponent]
})
export class AppModule {}

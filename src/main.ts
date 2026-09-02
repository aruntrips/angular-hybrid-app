// src/main.ts
//
// Import order matters here:
// 1. reflect-metadata FIRST - polyfills Reflect.metadata/getMetadata so
//    the design:paramtypes TypeScript emits (via emitDecoratorMetadata
//    in tsconfig.json) actually gets stored somewhere. Without this,
//    Angular's JIT compiler can't tell that TaskListComponent's
//    constructor wants a TaskService at parameter index 0, and throws
//    NG0202. (Only needed because this uses plain ts-loader/JIT, not
//    the Angular CLI's AOT compiler, which bakes this in at build
//    time instead.)
// 2. zone.js - patches async APIs for Angular's change detection.
import 'reflect-metadata';
import 'zone.js';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error('Bootstrap failed:', err));

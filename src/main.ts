// Polyfills for Node.js globals in browser environment
(window as any).global = window;
(window as any).process = {
  env: {},
  nextTick: (fn: Function) => setTimeout(fn, 0),
  version: '',
  platform: 'browser'
};

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppShellComponent } from './app/app-shell.component';

bootstrapApplication(AppShellComponent, appConfig)
  .catch((err) => console.error(err));

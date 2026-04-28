import { Routes } from '@angular/router';

export const PROCESSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./processes.page').then((m) => m.ProcessesPage)
  }
];

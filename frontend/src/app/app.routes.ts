import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./components/employees/employees.component').then((m) => m.EmployeesComponent),
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./components/attendance/attendance.component').then((m) => m.AttendanceComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'spents',
    loadComponent: () => import('./features/spents/pages/spents.component').then(m => m.SpentsComponent)
  },
  {
    path: 'incomes',
    loadComponent: () => import('./features/incomes/pages/incomes.component').then(m => m.IncomesComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/pages/categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: 'payments',
    loadComponent: () => import('./features/payments/pages/payments.component').then(m => m.PaymentsComponent)
  },
  {
    path: 'types',
    loadComponent: () => import('./features/types/pages/types.component').then(m => m.TypesComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/pages/users.component').then(m => m.UsersComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];

import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Rutas públicas
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent)
  },

  // Rutas protegidas
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/pages/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'spents',
    canActivate: [authGuard],
    loadComponent: () => import('./features/spents/pages/spents.component').then(m => m.SpentsComponent)
  },
  {
    path: 'incomes',
    canActivate: [authGuard],
    loadComponent: () => import('./features/incomes/pages/incomes.component').then(m => m.IncomesComponent)
  },
  {
    path: 'categories',
    canActivate: [authGuard],
    loadComponent: () => import('./features/categories/pages/categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: 'payments',
    canActivate: [authGuard],
    loadComponent: () => import('./features/payments/pages/payments.component').then(m => m.PaymentsComponent)
  },
  {
    path: 'types',
    canActivate: [authGuard],
    loadComponent: () => import('./features/types/pages/types.component').then(m => m.TypesComponent)
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () => import('./features/users/pages/users.component').then(m => m.UsersComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];

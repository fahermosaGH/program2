// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { Sucursales } from './sucursales/sucursales';
import { Reloj } from './reloj/reloj';
import { Home } from './home/home';
import { Clientes } from './clientes/clientes';
import { Ventas } from './ventas/ventas';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  // Login (carga diferida del componente real)
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent),
  },

  // Rutas protegidas con roles
  {
    path: 'ventas',
    component: Ventas,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'operador', 'consulta'] }
  },
  {
    path: 'clientes',
    component: Clientes,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'operador'] }
  },
  {
    path: 'sucursales',
    component: Sucursales,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },

  // Páginas libres
  { path: 'inicio', component: Home },
  { path: 'reloj', component: Reloj },

  // Redirecciones
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];


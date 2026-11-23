import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { MainLayout } from './shared/components/layout/main-layout';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    // Página pública — cliente acompanha a OS pelo código, sem login.
    path: 'acompanhar',
    loadComponent: () =>
      import('./features/acompanhamento/acompanhamento').then((m) => m.Acompanhamento),
  },
  {
    path: 'acompanhar/:codigo',
    loadComponent: () =>
      import('./features/acompanhamento/acompanhamento').then((m) => m.Acompanhamento),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'clientes',
        loadComponent: () => import('./features/clientes/clientes-list').then((m) => m.ClientesList),
      },
      {
        path: 'tecnicos',
        loadComponent: () => import('./features/tecnicos/tecnicos-list').then((m) => m.TecnicosList),
      },
      {
        path: 'servicos',
        loadComponent: () => import('./features/servicos/servicos-list').then((m) => m.ServicosList),
      },
      {
        path: 'ordens-servico',
        loadComponent: () =>
          import('./features/ordens-servico/ordens-servico-list').then((m) => m.OrdensServicoList),
      },
      {
        path: 'ordens-servico/:id',
        loadComponent: () =>
          import('./features/ordens-servico/ordem-servico-detail').then((m) => m.OrdemServicoDetail),
      },
      {
        path: 'usuarios',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/usuarios/usuarios-list').then((m) => m.UsuariosList),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

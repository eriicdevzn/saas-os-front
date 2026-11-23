import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Libera a rota apenas para usuários com perfil ADMINISTRADOR. */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.perfil() === 'ADMINISTRADOR') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};

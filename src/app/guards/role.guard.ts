import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService, Rol } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data?.['roles'] as Rol[]) ?? [];
  return auth.hasRole(roles).pipe(map(ok => {
    if (ok) return true;
    router.navigate(['/login']); return false; // o /forbidden si querés
  }));
};

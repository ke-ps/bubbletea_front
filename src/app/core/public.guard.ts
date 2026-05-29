import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from './auth.service';

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userOnce().pipe(
    map((user) => {
      if (user) {
        return router.createUrlTree(['/home']);
      }

      return true;
    }),
  );
};

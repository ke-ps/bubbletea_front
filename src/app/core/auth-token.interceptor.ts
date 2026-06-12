import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';

import { AuthService } from './auth.service';

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/api/')) {
    return next(request);
  }

  const authService = inject(AuthService);

  return from(authService.getIdToken()).pipe(
    switchMap((token) => {
      if (!token) {
        console.warn('No token available for request:', request.url);
        return next(request);
      }

      return next(
        request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
    }),
    catchError((error) => {
      console.error('Auth interceptor error:', error);
      return throwError(() => error);
    }),
  );
};

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  const isAuthRoute = req.url.includes('/auth/');  // ← no tocar rutas de auth

  const token = auth.getToken();
  const authReq = token && !isAuthRoute            // ← no adjuntar token en auth
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (isAuthRoute) return throwError(() => err);  // ← no interceptar errores de auth

      if (err.status === 401 && auth.currentUser()?.refreshToken) {
        return auth.refreshToken().pipe(
          switchMap(tokens => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${tokens.access_token}` }
            });
            return next(retryReq);
          }),
          catchError(() => {
            auth.logout();
            return throwError(() => err);
          })
        );
      }
      if (err.status === 403) {
        auth.logout();
      }
      return throwError(() => err);
    })
  );
};
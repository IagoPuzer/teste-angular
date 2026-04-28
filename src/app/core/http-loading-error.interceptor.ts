import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { LoadingService } from './loading.service';

export const httpLoadingErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.start();

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP error:', error.message);
      return throwError(() => error);
    }),
    finalize(() => loadingService.stop())
  );
};

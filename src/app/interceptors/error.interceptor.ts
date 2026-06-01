import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError(error => {
      const message = error.error?.message || 'Something went wrong';

      switch (error.status) {
        case 401:
          auth.logout();
          router.navigate(['/login']);
          notify.error('Session expired. Please login again.');
          break;
        case 403:
          notify.error('You do not have permission to perform this action.');
          router.navigate(['/home']);
          break;
        case 404:
          notify.error(message || 'Resource not found.');
          break;
        case 400:
          notify.error(message);
          break;
        case 500:
          notify.error('Server error. Please try again later.');
          break;
        default:
          notify.error(message);
      }

      return throwError(() => error);
    })
  );
};

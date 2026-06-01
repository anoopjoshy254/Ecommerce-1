import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return true;
  }
  // Redirect based on role
  if (auth.isSeller()) {
    router.navigate(['/seller/dashboard']);
  } else {
    router.navigate(['/home']);
  }
  return false;
};

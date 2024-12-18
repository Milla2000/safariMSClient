// guards.ts
import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { ToastService } from '../services/toast.service';

// Utility function to inject dependencies and show a toast + navigate
const handleUnauthorizedAccess = (message: string, redirectPath: string) => {
  const router = inject(Router);
  const toastService = inject(ToastService);
  toastService.showToast(message);
  router.navigate([redirectPath]);
  return false;
};

// AuthGuard: Protects routes by ensuring the user is authenticated
export const AuthGuard = () => {
  console.log('AuthGuard');
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  return handleUnauthorizedAccess(
    'Unauthorized, kindly login to place a booking',
    '/login'
  );
};

// RoleGuard: Protects routes by ensuring the user has the correct role
export const RoleGuard = (route: ActivatedRouteSnapshot) => {
  const expectedRole = route.data['role'];
  const userRole = localStorage.getItem('role');

  if (userRole && userRole === expectedRole) {
    return true;
  }

  return handleUnauthorizedAccess(
    'Unauthorized, You do not have the required role to access this page',
    '/tour'
  );
};

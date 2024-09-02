// guards.ts
import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

// AuthGuard: Protects routes by ensuring the user is authenticated
export const AuthGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};

// RoleGuard: Protects routes by ensuring the user has the correct role
export const RoleGuard = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const expectedRole = route.data['role'];
  const userRole = localStorage.getItem('role');

  if (userRole && userRole === expectedRole) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};

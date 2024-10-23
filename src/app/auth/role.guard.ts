// guards.ts
import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

// AuthGuard: Protects routes by ensuring the user is authenticated
export const AuthGuard = () => {
   console.log('AuthGuard')
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    console.log('Token:', token);
    return true;
    
  }
  console.error('Unauthorized', Error);
  router.navigate(['/login']);
  return false;
};

// RoleGuard: Protects routes by ensuring the user has the correct role
export const RoleGuard = (route: ActivatedRouteSnapshot) => {
  console.log('RoleGuard');
  const router = inject(Router);
  const expectedRole = route.data['role'];
  const userRole = localStorage.getItem('role');

  if (userRole && userRole === expectedRole) {
    console.log('Role:', userRole);
    return true;
  }
  console.error('Unauthorized', Error);
  router.navigate(['/dashboard']);
  return false;
};

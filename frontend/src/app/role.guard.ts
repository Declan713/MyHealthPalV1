import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Gets the expected role from the route data
    const expectedRole = route.data['expectedRole'];
    // Gets the current user from AuthService
    const currentUser = this.authService.currentUserValue;

    // Checks if there's a logged-in user and if the user's role matches the expected role
    if (currentUser && currentUser.role === expectedRole) {
      return true;
    } else {
      // Go to login in page if user hasn't got a role
      this.router.navigate(['/login']);
      return false;
    }
  }
}

// admin.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const currentUser = this.authService.currentUserValue;

    if (currentUser && currentUser.role === 'admin') {
      // User is an admin
      this.router.navigate(['/adminHome']);
      return true;
    } else {
      // User is not an admin, redirect to a suitable page
      this.router.navigate(['/home']);
      return false;
    }
  }
}

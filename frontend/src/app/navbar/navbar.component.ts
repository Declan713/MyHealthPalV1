import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../api.service'; 
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuOpen: boolean = false;
  basketCount: number = 0;
  faShoppingCart = faShoppingCart;
  
  constructor(private authService: AuthService, private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchBasketCount();
  }

  fetchBasketCount() {
    // Fetch immediately and then every 30 seconds to keep the basket count updated
    interval(30000).pipe(
      startWith(0),
      switchMap(() => this.apiService.getBasketCount())
    ).subscribe({
      next: (response) => {
        this.basketCount = response.count;
      },
      error: (error) => {
        console.error('Failed to fetch basket count', error);
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  isAdmin(): boolean {
    const currentUser = this.authService.currentUserValue;
    return !!currentUser && currentUser.role === 'admin';
  }

  isUser(): boolean {
    const currentUser = this.authService.currentUserValue;
    return !!currentUser && currentUser.role === 'user';
  }

  isGP(): boolean {
    const currentUser = this.authService.currentUserValue;
    return !!currentUser && currentUser.role === 'GP';
  }

  isLoggedIn(): boolean {
    return !!this.authService.currentUserValue;
  }

  getHomeRoute(): string {
    if (!this.isLoggedIn()) {
      return '/login';
    }
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      switch (currentUser.role) {
        case 'admin':
          return '/adminHome';
        case 'user':
          return '/home';
        case 'GP':
          return '/gpHome';
        default:
          return '/login'; 
      }
    }
    return '/login';
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log(response.message);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed', error);
      }
    });
  }
}

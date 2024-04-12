import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuOpen: boolean = false;
  
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
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
    const loggedIn = !!this.authService.currentUserValue;
    return loggedIn;
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

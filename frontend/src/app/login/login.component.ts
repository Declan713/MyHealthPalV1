import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isActive = false; 
  isLoading = false;
  errorMessage: string = '';
  regErrorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      medicalNumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    this.isLoading = true;
    if (!this.loginForm.valid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      this.isLoading = false;
      return;
    }

    const credentials = this.loginForm.value;
    this.authService.login(credentials.email, credentials.password).subscribe({
      next: (response: any) => {
        console.log('Login Successful', response);
        localStorage.setItem('currentUserToken', JSON.stringify(response));
        this.authService.setLoggedInUser(response);

        switch(response.role) {
          case 'admin':
            this.router.navigate(['/adminHome']);
            break;
          case 'user':
            this.router.navigate(['/home']);
            break;
          case 'GP':
            this.router.navigate(['/gpHome']);
            break;
          default:
            this.errorMessage = 'Role not recognised, contact support.';
            this.isLoading = false;
            this.loginForm.enable();
            return;
        }
      },
      error: (error) => {
        this.errorMessage = 'Invalid username or password';
        this.isLoading = false;
        this.loginForm.enable();
      }
    });
  }

  onRegister() {
    if (!this.registerForm.valid) {
      this.regErrorMessage = 'Please fill out all fields correctly.';
      return;
    }

    const newUser = this.registerForm.value;
    this.authService.register(newUser).subscribe({
      next: (response) => {
        localStorage.setItem('currentUserToken', JSON.stringify(response));
        this.authService.setLoggedInUser(response);

        switch(response.role) {
          case 'admin':
            this.router.navigate(['/adminHome']);
            break;
          case 'user':
            this.router.navigate(['/home']);
            break;
          case 'GP':
            this.router.navigate(['/gpHome']);
            break;
          default:
            this.regErrorMessage = 'Role not recognised, contact support.';
            return;
        }
      },
      error: (error) => {
        this.regErrorMessage = 'Registration failed. Please try again.';
      }
    });
  }

  toggleView() {
    this.isActive = !this.isActive;
  }
}

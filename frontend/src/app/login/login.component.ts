import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid && !this.isLoading) {
      const credentials = this.loginForm.value;
      console.log('Sending credentials:', credentials);
      this.isLoading = true;
      this.errorMessage = '';
  
      this.loginForm.disable();
  
      this.authService.login(credentials.email, credentials.password).subscribe({
        next: (response: any) => {
          console.log('Login Successful:', response);
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
        error: (error: HttpErrorResponse) => {
          
          console.error('Login Failed:', error);
      
          if (error.status === 401) {
            this.errorMessage = 'Authentication Failed. Invalid username or password.';
          } else {
            this.errorMessage =
              error && error.message
                ? error.message
                : 'An unexpected error occurred. Please try again later.';
          }
          this.isLoading = false;
          this.loginForm.enable();
        }
      });
    }
  }
}

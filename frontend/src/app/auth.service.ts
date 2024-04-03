import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


export interface AuthResponse {
  access_token: string;
  name?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<AuthResponse | null>;
  public currentUser: Observable<AuthResponse | null>;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();


  private BASE_URL = 'http://127.0.0.1:5000'; 

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.loadUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
    this.isLoggedInSubject.next(!!this.currentUserSubject.value);
  }

  public get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  private loadUserFromStorage(): AuthResponse | null {
    const currentUserFromStorage = localStorage.getItem('currentUser');
    return currentUserFromStorage ? JSON.parse(currentUserFromStorage) : null;
  }

  login(email: string = '', password: string = ''): Observable<AuthResponse> {
    const body = { email, password };  
  
    return this.http.post<any>(`${this.BASE_URL}/login`, body)
      .pipe(
        map(response => {
          if (typeof response === 'string') {
            throw new Error(response);
          }
  
          const authResponse: AuthResponse = {
            access_token: response.token,
            role: response.role
          };
  
          localStorage.setItem('currentUser', JSON.stringify(authResponse));
          this.currentUserSubject.next(authResponse);
          this.isLoggedInSubject.next(true);
          if (authResponse.role) {
            
          }
          return authResponse;
        }),
        catchError(this.handleError)
      );
  }

  public getToken(): string | null {
    const currentUser = this.loadUserFromStorage();
    return currentUser ? currentUser.access_token : null;
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  

  private handleError(error: any) {
    console.error('Authentication failed:', error);
    return throwError(() => error);
  }
}

 


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface AuthResponse {
  token: string;
  user_id: string;
  name?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Handles the state of the current user
  private currentUserSubject: BehaviorSubject<AuthResponse | null>;
  public currentUser: Observable<AuthResponse | null>;
  // tracking the logged in status
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private BASE_URL = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {
    // Loads current user from local storage
    const userJson = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(userJson ? JSON.parse(userJson) : null);
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.loadUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
    // Sets the users logegd in status
    this.isLoggedInSubject.next(this.isValidUser(this.currentUserSubject.value));
  }

  // Getter 
  public get currentUserValue(): AuthResponse | null {
    const user = this.currentUserSubject.value;
    // console.log('Current User:', user);
    return user;
  }

  // Setter
  setLoggedInUser(user: AuthResponse): void {
    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
  }

  // Checks if user onject valid
  private isValidUser(user: AuthResponse | null): boolean {
    return !!user && !!user.token;
  }

  // Loads user data from the local storage
  private loadUserFromStorage(): AuthResponse | null {
    const currentUserToken = localStorage.getItem('currentUserToken');
    return currentUserToken ? JSON.parse(currentUserToken) : null;
  }


  // Handles the login in with my backend route 
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/login`, { email, password }).pipe(
      map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        console.log('Login successful, user:', user);
        return user;
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  // Handles the logout with my backend route
  logout(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      this.clearLocalUserData();
      return throwError(() => new Error('Authentication token not found'));
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`${this.BASE_URL}/logout`, {}, { headers })
      .pipe(
        tap(() => this.clearLocalUserData()),
        catchError(this.handleError)
      );
  }


  // Clears local storage once user logs out 
  clearLocalUserData(): void {
    localStorage.removeItem('currentUserToken');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  // gets the users authentication token 
  public getToken(): string | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.token : null;
  }

  // Handles the registering of a new user with my backend route 
  register(userData: {name: string, email: string, medicalNumber: string, password: string}): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, userData)
      .pipe(catchError(this.handleError));
  }

  // Error handler for Http requests
  private handleError(error: any) {
    console.error('Authentication failed:', error);
    return throwError(() => error);
  }
}

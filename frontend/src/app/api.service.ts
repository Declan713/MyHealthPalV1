import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';



@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiUrl = 'http://127.0.0.1:5000';
  

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken(); 
    console.log('Token:', token)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log('Headers:', headers);

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private handleUnauthorizedError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {

    }
    return throwError(() => error);
  }



 


}
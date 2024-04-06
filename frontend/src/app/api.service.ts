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
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Fetch all users
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users`, { headers: this.getHeaders() });
  }
  
  // Edit a user
  editUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/edit_user/${userId}`, userData, { headers: this.getHeaders() });
  }

  // Delete a user
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/delete_user/${userId}`, { headers: this.getHeaders() });
  }

  // Fetch all GPs
  getAllGPs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/gps`, { headers: this.getHeaders() });
  }

  // Edit a GP
  editGp(gpId: string, gpData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/edit_gp/${gpId}`, gpData, { headers: this.getHeaders() });
  }


 
}

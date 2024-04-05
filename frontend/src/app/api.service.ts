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

  // Fetch all GPs
  getAllGPs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/gps`, { headers: this.getHeaders() });
  }

  // Add a new item
//   addItem(itemData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/admin/add_item`, itemData, { headers: this.getHeaders() });
//   }

//   // Edit an item
//   editItem(item_id: string, itemData: any): Observable<any> {
//     return this.http.put(`${this.apiUrl}/admin/edit_item/${item_id}`, itemData, { headers: this.getHeaders() });
//   }

//   // Delete an item
//   deleteItem(item_id: string): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/admin/delete_item/${item_id}`, { headers: this.getHeaders() });
//   }

//   // Add a GP
//   addGP(gpData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/admin/add_gp`, gpData, { headers: this.getHeaders() });
//   }

//   // Edit a GP's Info
//   editGPInfo(gp_id: string, gpData: any): Observable<any> {
//     return this.http.put(`${this.apiUrl}/admin/edit_gp/${gp_id}`, gpData, { headers: this.getHeaders() });
//   }

//   // Delete a GP
//   deleteGP(gp_id: string): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/admin/delete_gp/${gp_id}`, { headers: this.getHeaders() });
//   }
}

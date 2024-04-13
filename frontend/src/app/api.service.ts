import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
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

  ///Routes////

  // Get all items
  getAllItems(page: number, pageSize: number = 12, sort: string = 'name', dir: string = 'asc'): Observable<any> {
    let params = new HttpParams()
      .set('pn', page.toString())
      .set('ps', pageSize.toString())
      .set('sort', sort)
      .set('dir', dir);
  
    return this.http.get(`${this.apiUrl}/items`, { headers: this.getHeaders(), params: params });
  }


  // Get one item
  getItem(itemId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/items/${itemId}`, { headers: this.getHeaders() });
  }

  // Delete item review
  deleteReview(itemId: string, reviewId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${itemId}/reviews/${reviewId}`, { headers: this.getHeaders() });
  }


  ///////////////////////////////////////
  //////////Admin Routes/////////

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

  // Delete a GP 
  deleteGp(gpId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/delete_gp/${gpId}`, { headers: this.getHeaders() });
  }

   // Add a GP
   addGp(gpData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/add_gp`, gpData, { headers: this.getHeaders() });
  }

  // View Admin Account
  getAdminProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/profile`, { headers: this.getHeaders() });
  }

  // Add New Item
  addItem(itemData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/add_item`, itemData, { headers: this.getHeaders() });
  }

  // Delete a Item
  deleteItem(itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/delete_item/${itemId}`, { headers: this.getHeaders() });
  }



 
}

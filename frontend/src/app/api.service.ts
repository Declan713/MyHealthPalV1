import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, catchError} from 'rxjs';
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

  private handleErrors(error: HttpErrorResponse) {
    let errorMessage = 'Server Error';
    if (error.error instanceof ErrorEvent) {
      console.log('An error occurred:', error.error.message);
      errorMessage = error.error.message;
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
      errorMessage = error.message || 'Something went wrong with the request.';
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    return throwError(() => new Error(error.error.message || 'Server error'));
  }


  ///Routes////

  // Get all items
  getAllItems(page: number, pageSize: number = 12, sort: string = 'name', dir: string = 'asc'): Observable<any> {
    let params = new HttpParams()
      .set('pn', page.toString())
      .set('ps', pageSize.toString())
      .set('sort', sort)
      .set('dir', dir);
  
    return this.http.get(`${this.apiUrl}/items`, { headers: this.getHeaders(), params: params })
    .pipe(catchError(this.handleErrors));
  }


  // Get one item
  getItem(itemId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/items/${itemId}`, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // Delete item review
  deleteReview(itemId: string, reviewId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${itemId}/reviews/${reviewId}`, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // Search Item
  searchItems(query: string, category:string): Observable<any> {
    let params = new HttpParams()
    .set('searchQuery', query)
    .set('category', category);
    return this.http.get(`${this.apiUrl}/items/search`, { headers: this.getHeaders(), params: params })
    .pipe(catchError(this.handleErrors));
  }


  ///////////////////////////////////////
  //////////Admin Routes////////////////

  // Fetch all users
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users`, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }
  
  // Edit a user
  editUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/edit_user/${userId}`, userData, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // Delete a user
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/delete_user/${userId}`, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // Fetch all GPs
  getAllGPs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/gps`, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // Edit a GP
  editGp(gpId: string, gpData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/edit_gp/${gpId}`, gpData, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // Delete a GP 
  deleteGp(gpId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/delete_gp/${gpId}`, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

   // Add a GP
   addGp(gpData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/add_gp`, gpData, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // View Admin Account
  getAdminProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/profile`, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // Add New Item
  addItem(itemData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/add_item`, itemData, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // Delete a Item
  deleteItem(itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/delete_item/${itemId}`, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

   ///////////////////////////////////////
  /////////User Routes///////////////////

  // add item to basket 
  addToBasket(itemId: string): Observable<any> {
    const item = {_id: itemId};
    return this.http.post(`${this.apiUrl}/user/basket/add`, item, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // Get Basket Item Count
  getBasketCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/user/basket/count`, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // View Basket
  viewBasket(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/basket`, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // Remove Item or decrease item quantity from Basket
  updateBasket(itemId: string, decrement: number): Observable<any> {
    const body = { _id: itemId, quantity: decrement };
    // console.log(`Sending request to ${this.apiUrl}/user/basket/update with`, body);  
    return this.http.post(`${this.apiUrl}/user/basket/update`, body, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // View User Account
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user_profile`, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // Book Appointment 
  bookAppointment(medicalNumber: string, appointmentDate: string): Observable<any> {
    const body = { medicalNumber: medicalNumber, appointment_date: appointmentDate };
    // console.log('Booking appointment with:', body);
    return this.http.post(`${this.apiUrl}/book/appointment`, body, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // View Appointments
  getUserAppointments(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user_appointments/${userId}`, { headers: this.getHeaders() })
    .pipe(catchError(this.handleErrors));
  }

  // Delete Declined Appointents
  deleteAppointment(appointmentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/appointments/delete_declined/${appointmentId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleErrors));
  }

  // Purchase Items in the basket
  purchaseItems(): Observable<any> {
    return this.http.post(`${this.apiUrl}/purchase`, {}, { headers: this.getHeaders() })
      .pipe(catchError(this.handleErrors));
  }

  // Add Review to an Item
  addReview(itemId: string, reviewData: { rating: number; comment: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/items/${itemId}/add_review`, reviewData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleErrors));
  }

  // Edit a Review 
  editReview(itemId: string, reviewId: string, reviewData: { rating: number; comment: string }): Observable<any> {
    // console.log(`Sending PUT request to /items/${itemId}/reviews/${reviewId}`, reviewData);
    return this.http.put(`${this.apiUrl}/items/${itemId}/reviews/${reviewId}`, reviewData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleErrors));
  }

  ///////////////////////////////////////
  /////////GP Routes///////////////////

  // View GP Profile
  getGpProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/gp/profile`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleErrors));
  }

  // View Gp Appointments
  getGpAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/gp_appointments`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleErrors));
  }

  // Edit Appointments
  editAppointmentStatus(appointmentId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/appointments/edit_status/${appointmentId}`, { status: status }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleErrors));
  }

 
}

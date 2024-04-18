import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-user-appointments',
  templateUrl: './user-appointments.component.html',
  styleUrls: ['./user-appointments.component.css']
})
export class UserAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.fetchAppointments(user.user_id);  
      } else {
        this.errorMessage = "Please log in.";
      }
    });
  }

  fetchAppointments(userId: string): void {
    this.isLoading = true;
    this.apiService.getUserAppointments(userId).subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Failed to fetch appointments: ${error}`;
        this.isLoading = false;
      }
    });
  }


  deleteAppointment(appointmentId: string): void {
    this.isLoading = true;
    this.apiService.deleteAppointment(appointmentId).subscribe({
      next: () => {
        this.appointments = this.appointments.filter(app => app._id !== appointmentId);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to delete appointment:', error);
        this.errorMessage = `Failed to delete appointment: ${error}`;
        this.isLoading = false;
      }
    });
  }

}

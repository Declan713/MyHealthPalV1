import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';


@Component({
  selector: 'app-user-booking',
  templateUrl: './user-booking.component.html',
  styleUrls: ['./user-booking.component.css']
})
export class UserBookingComponent implements OnInit {
  isLoading = false;
  message: string | null = null;
  medicalNumber: string | null = null;
  appointmentDate: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {}

  bookAppointment(): void {
    if (!this.medicalNumber || !this.appointmentDate) {
      this.message = 'Please enter your medical number and select a date and time for your appointment.';
      return;
    }
    this.isLoading = true;
    this.apiService.bookAppointment(this.medicalNumber, this.appointmentDate).subscribe({
      next: () => {
        this.message = 'Appointment booked successfully!';
        this.isLoading = false;
        setTimeout(() => this.message = null, 2000);
      },
      error: (errorMessage) => {
        this.message = `Failed to book appointment: ${errorMessage}`;
        this.isLoading = false;
        setTimeout(() => this.message = null, 2000);
      }
    });
  }


}

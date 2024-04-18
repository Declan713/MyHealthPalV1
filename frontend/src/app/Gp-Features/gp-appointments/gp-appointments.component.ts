import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-gp-appointments',
  templateUrl: './gp-appointments.component.html',
  styleUrls: ['./gp-appointments.component.css']
})
export class GpAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.isLoading = true;
    this.apiService.getGpAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load appointments:', error);
        this.isLoading = false;
      }
    });
  }

  updateAppointmentStatus(appointmentId: string, status: string) {
    this.apiService.editAppointmentStatus(appointmentId, status).subscribe({
      next: (response) => {
        console.log(response.message);
        this.loadAppointments();
      },
      error: (error) => {
        console.error('Error updating appointment:', error);
        this.errorMessage = "Error updating appointment";
      }
    });
  }
}

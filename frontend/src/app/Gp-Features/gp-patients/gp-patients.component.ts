import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-gp-patients',
  templateUrl: './gp-patients.component.html',
  styleUrls: ['./gp-patients.component.css']
})
export class GpPatientsComponent implements OnInit {
  patients: any[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getPatients();
  }

  getPatients(): void {
    this.loading = true;
    this.apiService.getGpPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
        console.error('Failed to fetch patients:', err);
      }
    });
  }
}

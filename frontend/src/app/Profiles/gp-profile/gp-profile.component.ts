import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-gp-profile',
  templateUrl: './gp-profile.component.html',
  styleUrls: ['./gp-profile.component.css']
})
export class GpProfileComponent implements OnInit {
  gpProfile: any = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchGpProfile();
  }

  fetchGpProfile() {
    this.isLoading = true;
    this.apiService.getGpProfile().subscribe({
      next: (profile) => {
        this.gpProfile = profile;
        this.isLoading= false;
      },
      error: (error) => {
        console.error('Failed to load GP profile:', error);
        this.error = "Failed to load the GP profile"
        this.isLoading = false;
      }
    });
  }
}

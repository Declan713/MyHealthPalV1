import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  adminProfile: any = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchAdminProfile();
  }

  fetchAdminProfile() {
    this.isLoading = true;
    this.apiService.getAdminProfile().subscribe({
      next: (profile) => {
        this.adminProfile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to fetch admin profile:', error);
        this.error = "Failed to load the profile.";
        this.isLoading = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfile: any = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    this.isLoading = true;
    this.apiService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to fetch user profile:', error);
        this.error = "Failed to load the profile.";
        this.isLoading = false;
      }
    });
  }
}

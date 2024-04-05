import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-admin-features',
  templateUrl: './admin-features.component.html',
  styleUrl: './admin-features.component.css'
})
export class AdminFeaturesComponent implements OnInit {
  // users: any[] = [];
  // gps: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // this.loadUsers();
    // this.loadGPs();
  }

  // loadUsers() {
  //   this.apiService.getAllUsers().subscribe({
  //     next: (users) => {
  //       console.log('Users:', users); 
  //       this.users = users;
  //     },
  //     error: (error) => console.error('Failed to fetch users', error),
  //   });
  // }

  // loadGPs() {
  //   this.apiService.getAllGPs().subscribe({
  //     next: (gps) => {
  //       console.log('GPs:', gps); 
  //       this.gps = gps;
  //     },
  //     error: (error) => console.error('Failed to fetch GPs', error),
  //   });
  // }
}
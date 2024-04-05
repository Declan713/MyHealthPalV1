import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service'; 

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getAllUsers().subscribe({
      next: (data) => {
        console.log('Received users data:', data);
        this.users = data;
      },
      error: (error) => console.error('Error fetching users:', error)
    });
  }
}

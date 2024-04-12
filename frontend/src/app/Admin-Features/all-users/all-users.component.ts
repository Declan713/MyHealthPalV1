import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {
  users: any[] = [];
  showEditModal = false;
  selectedUser: any = {};

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.apiService.getAllUsers().subscribe(data => {
      this.users = data;
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  openEditModal(user: any) {
    this.selectedUser = { ...user };
    this.showEditModal = true;
  }

  editUser(updatedUserData: any) {
    this.apiService.editUser(updatedUserData._id, updatedUserData).subscribe({
      next: (response) => {
        console.log('User updated', response);
        this.showEditModal = false; 
        this.fetchUsers(); 
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
}

  
  deleteUser(userId: string) {
    if(confirm('Are you sure you want to delete this user?')) {
      this.apiService.deleteUser(userId).subscribe({
        next: (response) => {
          console.log('User deleted', response);
          this.users = this.users.filter(user => user._id !== userId);
        },
        error: (error) => console.error('Error deleting user:', error)
      });
    }
  }


}

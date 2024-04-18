import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-all-gps',
  templateUrl: './all-gps.component.html',
  styleUrls: ['./all-gps.component.css']
})
export class AllGpsComponent implements OnInit {
  gps: any[] = [];
  showEditModal = false;
  showAddGpModal = false;
  selectedGp: any = {}

  constructor(private apiService: ApiService) {}


  ngOnInit() {
    this.fetchGPs();
  }

  fetchGPs() {
    this.apiService.getAllGPs().subscribe({
      next: (gp_data) => {
        console.log('Received gps data:', gp_data);
        this.gps = gp_data;
      },
      error: (error) => console.error('Error fetching gps:', error)
    });
  }

  openEditModal(gp: any) {
    this.selectedGp = { ...gp };
    this.showEditModal = true;
  }

  editGp(updatedGpData: any) {
    this.apiService.editGp(updatedGpData._id, updatedGpData).subscribe({
      next: (response) => {
        console.log('GP updated', response);
        this.showEditModal = false; 
        this.fetchGPs(); 
      },
      error: (error) => {
        console.error('Error updating GP:', error);
      }
    });
  }

  openAddGpModal() {
    console.log('Opening add Gp Modal...')
    this.showAddGpModal = true;
    console.log('Modal State:', this.showAddGpModal);
  }

  addGp(newGp: any) {
    console.log('Added Gp:', newGp);
    this.apiService.addGp(newGp).subscribe({
      next: (response) => {
        console.log('Gp added', response);
        this.showAddGpModal = false;
        this.fetchGPs();
      },
      error: (error) => {
        console.error('Error adding Gp', error);
        this.showAddGpModal = false;
      }
    });
  }

  deleteGp(gpId: string) {
    if(confirm('Are you sure you want to delete this GP?')) {
      this.apiService.deleteGp(gpId).subscribe({
        next: (response) => {
          console.log('GP deleted', response);
          this.gps = this.gps.filter(gp => gp._id !== gpId);
        },
        error: (error) => console.error('Error deleting GP:', error)
      });
    }
  }


}
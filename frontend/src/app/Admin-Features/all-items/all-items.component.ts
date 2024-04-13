import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-all-items',
  templateUrl: './all-items.component.html',
  styleUrls: ['./all-items.component.css']
})
export class AllItemsComponent implements OnInit {
  items: any[] = [];
  page: number = 1;
  hasMoreData: boolean = true;
  sortDirection: 'asc' | 'desc' = 'asc';
  showAddItemModal = false; 

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.apiService.getAllItems(this.page, 12, 'name', this.sortDirection).subscribe({
      next: (data) => {
        this.items = data;
        this.hasMoreData = data.length === 12;
        console.log(data)
      },
      error: (error) => console.error('Failed to fetch items:', error)
    });
  }

  sortItemsAlphabetically() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.loadItems();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      sessionStorage.setItem('page', this.page.toString());
      this.loadItems();
    }
  }

  nextPage() {
    if (this.hasMoreData) {
      this.page++;
      sessionStorage.setItem('page', this.page.toString());
      this.loadItems();
    }
  }

  canGoNext(): boolean {
    return this.hasMoreData;
  }

  openAddItemModal() {
    console.log('Opening add item modal...');
    this.showAddItemModal = true;
    console.log('Modal state:', this.showAddItemModal);
  }
  
  addItem(newItem: any) {
    console.log('Adding item:', newItem);
    this.apiService.addItem(newItem).subscribe({
      next: (response) => {
        console.log('Item added', response);
        this.showAddItemModal = false;
        this.loadItems();
      },
      error: (error) => {
        console.error('Error adding item:', error);
        this.showAddItemModal = false;
      }
    });
  }

  deleteItem(itemId: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.apiService.deleteItem(itemId).subscribe({
        next: (response) => {
          console.log('Item deleted successfully:', response);
          this.items = this.items.filter(item => item._id !== itemId);
        },
        error: (error) => {
          console.error('Error deleting item:', error);
        }
      });
    }
  }
  

  

}

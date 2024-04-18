import { Component,  OnInit} from '@angular/core';
import { ApiService } from '../../api.service';


@Component({
  selector: 'app-all-user-items',
  templateUrl: './all-user-items.component.html',
  styleUrl: './all-user-items.component.css'
})
export class AllUserItemsComponent implements OnInit {
  items: any[] = [];
  page: number = 1;
  hasMoreData: boolean = true;
  sortDirection: 'asc' | 'desc' = 'asc';
  showAddItemModal = false; 
  searchQuery: string = '';
  category: string = '';

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

 

  onSearchItem() {
    if (this.searchQuery) {
      this.apiService.searchItems(this.searchQuery, this.category).subscribe({
        next: (response) => {
          this.items = response.results;
          this.hasMoreData = false;
        },
        error: (error) => console.error('Failed to fetch items:', error)
      });
    } else {
      this.loadItems();
    }
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



}

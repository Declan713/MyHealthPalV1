import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-all-items',
  templateUrl: './all-items.component.html',
  styleUrl: './all-items.component.css'
})
export class AllItemsComponent implements OnInit {
  items: any[] = []
  page: number = 1;
  hasMoreData: boolean = true; 

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page'])
    }
    this.loadItems();  
  }

  loadItems() {
    this.apiService.getAllItems(this.page).subscribe({
      next: (data) => {
        this.items = data;

        const itemsPerPage = 10

        this.hasMoreData = data.length === itemsPerPage
      },
      error: (error) => {
        console.error('Failed to fetch items:', error);
      }
    });
  }

  previousPage() {
    if (this.page > 1) {
      this.page = this.page - 1;
      sessionStorage['page'] = this.page;
      this.loadItems();
    }
  }

  nextPage() {
    this.page = this.page + 1;
    sessionStorage['page'] = this.page;
    this.loadItems();
  }

  canGoNext(): boolean {
    return this.hasMoreData;
  }


}

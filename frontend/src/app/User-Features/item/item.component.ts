import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent implements OnInit {
  faCartPlus = faCartPlus;
  item: any;
  reviews: any[] = [];
  reviewForm = this.fb.group({
    text: ['', Validators.required],
    rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]]  
  });


  constructor(private apiService: ApiService, private route: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.loadItem(itemId);
    }
  }
  

  loadItem(itemId: string) {
    this.apiService.getItem(itemId).subscribe({
      next: (data) => {
        this.item = data;
        this.reviews = data.item_reviews || [];
      },
      error: (error) => {
        console.error('Failed to fetch item:', error);
      }
    });
  }


  // add item to basket
  addToBasket() {
    const itemId = this.route.snapshot.params['id'];

    this.apiService.addToBasket(itemId).subscribe({
      next: (response: any) => {
        console.log('added to basket successfully!', response)
      },
      error: (error) => {
        console.error('Error adding')
      }
      
    })
    
  }

  // delete review from item (user-specific)
  deleteReview(reviewId: string) {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.apiService.deleteReview(itemId, reviewId).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(review => review.review_id !== reviewId);
        },
        error: (error) => console.error('Failed to delete review:', error)
      });
    }
  }

  
}

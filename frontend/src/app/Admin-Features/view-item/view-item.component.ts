import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.css']
})
export class ViewItemComponent implements OnInit {
  item: any;
  reviews: any[] = [];
  reviewForm = this.fb.group({
    text: ['', Validators.required],
    rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]]  
  });

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

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

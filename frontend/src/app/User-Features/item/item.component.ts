import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FlashMessageService } from '../../flash-message/flash-message.service';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  faCartPlus = faCartPlus;
  item: any;
  reviews: any[] = [];
  showAddReviewModal = false;
  


  constructor(private apiService: ApiService, private route: ActivatedRoute, private flashMessageService: FlashMessageService ) {}

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
          this.flashMessageService.showFlashMessage('Review deleted successfully!!');
        },
        error: (error) => {
          console.error('Failed to delete review:', error);
          this.flashMessageService.showFlashMessage('You can only delete your own reviews!!');
        }
      });
    }
  }

  openAddReviewModal() {
    console.log('Opening add item modal...');
    this.showAddReviewModal = true;
    console.log('Modal state:', this.showAddReviewModal);
  }

  closeAddReviewModal() {
    this.showAddReviewModal = false;
  }

  addReview(reviewData: any) {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.apiService.addReview(itemId, reviewData).subscribe({
        next: (response) => {
          console.log(reviewData);
          console.log('Review added successfully:', response);
          this.closeAddReviewModal();
        },
        error: (error) => console.error('Error adding review:', error)
      });
    }
  }

  
}

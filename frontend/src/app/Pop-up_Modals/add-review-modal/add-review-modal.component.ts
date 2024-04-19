import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-review-modal',
  templateUrl: './add-review-modal.component.html',
  styleUrls: ['./add-review-modal.component.css']
})
export class AddReviewModalComponent {
  review: any = { rating: null, comment: '' };  

  @Output() addReview = new EventEmitter<any>();
  @Output() closeModalEvent = new EventEmitter<void>();

  submitReview() {
    console.log('Submitting Review:', this.review);
    if (this.review.rating && this.review.comment) {
      this.addReview.emit(this.review);
      this.review = { rating: null, comment: '' };  
    }
  }

  closeModal() {
    console.log('Closing modal');
    this.closeModalEvent.emit();
  }
}

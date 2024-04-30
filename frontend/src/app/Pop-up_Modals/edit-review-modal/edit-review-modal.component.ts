import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-review-modal',
  templateUrl: './edit-review-modal.component.html',
  styleUrls: ['./edit-review-modal.component.css']
})
export class EditReviewModalComponent {
  @Input() reviewData: any = {};
  @Output() editReview = new EventEmitter<any>();
  @Output() closeModalEvent = new EventEmitter<void>();

  onSubmit() {
    this.editReview.emit(this.reviewData);
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}

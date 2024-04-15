import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();

  cardDetails = {
    cardNumber: '',
    expirationDate: '',
    cvv: ''
  };

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<PaymentModalComponent>) {}

  submitPayment() {
    this.apiService.purchaseItems().subscribe({
      next: (response) => {
        console.log('Purchase successful:', response);
        this.closeModal();
      },
      error: (error) => {
        console.error('Purchase failed:', error);
      }
    });
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}

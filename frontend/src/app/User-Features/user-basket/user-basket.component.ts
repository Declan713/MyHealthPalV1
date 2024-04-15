import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatDialog } from '@angular/material/dialog';
import { PaymentModalComponent } from '../../Pop-up_Modals/payment-modal/payment-modal.component';

@Component({
  selector: 'app-user-basket',
  templateUrl: './user-basket.component.html',
  styleUrls: ['./user-basket.component.css']
})
export class UserBasketComponent implements OnInit {
  basket: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  total: number = 0;
  

  constructor(private apiService: ApiService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadUserBasket();
  }

  loadUserBasket() {
    this.isLoading = true;
    this.apiService.viewBasket().subscribe({
      next: (data) => {
        console.log(data)
        this.basket = data;
        this.calculateTotal();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to fetch user basket:', error);
        this.error = "Failed to load the basket.";
        this.isLoading = false;
      }
    });
  }

  calculateTotal() {
    this.total = this.basket.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  removeItem(itemId: string, itemQuantity: number) {
    // console.log(`Removing item with ID ${itemId} and quantity ${itemQuantity}`);
    this.apiService.updateBasket(itemId, itemQuantity).subscribe({
      next: () => {
        console.log('Update successful, reloading basket.');
        this.loadUserBasket();
      },
      error: (error) => {
        console.log(itemId)
        console.error('Failed to update the basket:', error);
        this.error = "Failed to update the basket.";
      }
    });
  }


  openPaymentModal() {
    const dialogRef = this.dialog.open(PaymentModalComponent, {
      width: '300px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog was closed', result);
    });
  }
}

  // processPayment(paymentDetails: any) {
  //   console.log('Processing payment with details:', paymentDetails);
  //   this.apiService.purchaseItems().subscribe({
  //     next: (response) => {
  //       console.log('Purchase successful', response);
  //       this.isLoading = false;
  //       this.dialog.closeAll();

  //     },
  //     error: (error) => {
  //       console.error('Purchase failed:', error);
  //       this.error = "Purchase failed. Please try again.";
  //       this.isLoading = false;
  //     }
  //   });
  // }


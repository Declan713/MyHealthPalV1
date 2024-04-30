import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

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
  showPaymentModal = false;
  
  constructor(private apiService: ApiService) {}

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
    this.showPaymentModal = true;
  }

  // Reload the basket after successful payment
  onPaymentSuccess() {
    this.loadUserBasket(); 
  }



}
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlashMessageService {
  private flashMessage = new Subject<{ message: string, type: string }>();

  constructor() { }

  getFlashMessage() {
    return this.flashMessage.asObservable();
  }

  showFlashMessage(message: string, type: string = 'success') {
    this.flashMessage.next({ message, type });
    setTimeout(() => this.flashMessage.next({ message: '', type: '' }), 5000);
  }
  
}
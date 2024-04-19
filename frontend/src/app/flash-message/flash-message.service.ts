import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlashMessageService {
  private flashMessage = new Subject<string>();

  constructor() { }

  getFlashMessage() {
    return this.flashMessage.asObservable();
  }

  showFlashMessage(message: string) {
    this.flashMessage.next(message);
    setTimeout(() => this.flashMessage.next(null!), 5000);
  }
}

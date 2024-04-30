import { Component, OnInit  } from '@angular/core';
import { FlashMessageService } from './flash-message.service';

@Component({
  selector: 'app-flash-message',
  templateUrl: './flash-message.component.html',
  styleUrl: './flash-message.component.css'
})
export class FlashMessageComponent implements OnInit {
  message!: string;

  constructor(private flashMessageService: FlashMessageService) { }

  ngOnInit(): void {
    this.flashMessageService.getFlashMessage().subscribe(message => {
      this.message = message;
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { FlashMessageService } from './flash-message.service';

@Component({
  selector: 'app-flash-message',
  templateUrl: './flash-message.component.html',
  styleUrls: ['./flash-message.component.css']
})
export class FlashMessageComponent implements OnInit {
  message!: string;
  type!: string;

  constructor(private flashMessageService: FlashMessageService) { }

  ngOnInit(): void {
    this.flashMessageService.getFlashMessage().subscribe(({ message, type }) => {
      this.message = message;
      this.type = type;
    });
  }
}

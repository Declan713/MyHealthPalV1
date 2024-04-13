import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.css']
})
export class AddItemModalComponent {

  ngOnInit() {
    console.log('AddItemModalComponent loaded');
  }

  
  item: any = {};
  @Output() addItem = new EventEmitter<any>();
  @Output() closeModalEvent = new EventEmitter<void>();

  onSubmit() {
    console.log('Submitting item:', this.item);
    this.addItem.emit(this.item);
  }

  closeModal() {
    console.log('Closing modal');
    this.closeModalEvent.emit();
  }
}

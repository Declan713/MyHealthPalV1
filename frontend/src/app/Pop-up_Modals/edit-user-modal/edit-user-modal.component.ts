import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css']
})
export class EditUserModalComponent {
  @Input() user: any = {};
  @Output() updateUser = new EventEmitter<any>();
  @Output() closeModalEvent = new EventEmitter<void>();

  onSubmit() {
    this.updateUser.emit(this.user);
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}

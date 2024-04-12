import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-gp-modal',
  templateUrl: './edit-gp-modal.component.html',
  styleUrl: './edit-gp-modal.component.css'
})
export class EditGpModalComponent {
  @Input() gp: any = {};
  @Output() updateGp = new EventEmitter<any>();
  @Output() closeModalEvent = new EventEmitter<void>();

  onSubmit() {
    this.updateGp.emit(this.gp);
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}

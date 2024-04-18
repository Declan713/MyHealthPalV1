import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-gp-modal',
  templateUrl: './edit-gp-modal.component.html',
  styleUrls: ['./edit-gp-modal.component.css']
})
export class EditGpModalComponent {
  @Input() gp: any = {};
  @Output() updateGp = new EventEmitter<any>();
  @Output() closeModalEvent = new EventEmitter<void>();

  onSubmit() {
    if (typeof this.gp.medicalNumbers === 'string') {
      this.gp.medicalNumbers = this.gp.medicalNumbers.split(',').map((num: string) => num.trim()).filter((num: string) => num !== '');
    }
    this.updateGp.emit(this.gp);
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}

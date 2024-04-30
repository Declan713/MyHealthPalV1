import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-gp-modal',
  templateUrl: './add-gp-modal.component.html',
  styleUrls: ['./add-gp-modal.component.css']
})
export class AddGpModalComponent {

  ngOnInit() {
    console.log('AddGpModalComponent loaded');
  }

  
  Gp: any = {};
  @Output() addGp = new EventEmitter<any>();
  @Output() closeModalEvent = new EventEmitter<void>();

  onSubmit() {
    // Check if the medicalNumbers input is a string and contains data
    if (typeof this.Gp.medicalNumbers === 'string' && this.Gp.medicalNumbers.trim() !== '') {
        // Split the medicalNumbers string into an array by comma, trim each part, and filter out empty strings
        const medicalNumbersArray: string[] = 
        this.Gp.medicalNumbers.split(',').map((number: string) => number.trim()).filter((number: string) => number !== '');
        this.Gp.medicalNumbers = medicalNumbersArray;
    } else {
      this.Gp.medicalNumbers = [];
    }
    console.log('Submitting GP:', this.Gp);
    this.addGp.emit(this.Gp);
  }

  closeModal() {
    console.log('Closing modal');
    this.closeModalEvent.emit();
  }
}
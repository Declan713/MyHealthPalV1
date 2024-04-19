import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReviewModalComponent } from './add-review-modal.component';

describe('AddReviewModalComponent', () => {
  let component: AddReviewModalComponent;
  let fixture: ComponentFixture<AddReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReviewModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

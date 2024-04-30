import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReviewModalComponent } from './edit-review-modal.component';

describe('EditReviewModalComponent', () => {
  let component: EditReviewModalComponent;
  let fixture: ComponentFixture<EditReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReviewModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

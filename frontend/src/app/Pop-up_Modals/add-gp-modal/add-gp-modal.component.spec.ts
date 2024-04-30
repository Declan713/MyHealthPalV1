import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGpModalComponent } from './add-gp-modal.component';

describe('AddGpModalComponent', () => {
  let component: AddGpModalComponent;
  let fixture: ComponentFixture<AddGpModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGpModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGpModalComponent } from './edit-gp-modal.component';

describe('EditGpModalComponent', () => {
  let component: EditGpModalComponent;
  let fixture: ComponentFixture<EditGpModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGpModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditGpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

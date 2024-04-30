import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpAppointmentsComponent } from './gp-appointments.component';

describe('GpAppointmentsComponent', () => {
  let component: GpAppointmentsComponent;
  let fixture: ComponentFixture<GpAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpAppointmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GpAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

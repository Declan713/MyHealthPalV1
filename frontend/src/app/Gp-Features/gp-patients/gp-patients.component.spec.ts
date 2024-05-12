import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpPatientsComponent } from './gp-patients.component';

describe('GpPatientsComponent', () => {
  let component: GpPatientsComponent;
  let fixture: ComponentFixture<GpPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpPatientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GpPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

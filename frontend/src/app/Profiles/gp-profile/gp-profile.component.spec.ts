import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpProfileComponent } from './gp-profile.component';

describe('GpProfileComponent', () => {
  let component: GpProfileComponent;
  let fixture: ComponentFixture<GpProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GpProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

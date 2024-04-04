import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GPHomeComponent } from './gphome.component';

describe('GPHomeComponent', () => {
  let component: GPHomeComponent;
  let fixture: ComponentFixture<GPHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GPHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GPHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

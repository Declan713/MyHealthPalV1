import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGpsComponent } from './all-gps.component';

describe('AllGpsComponent', () => {
  let component: AllGpsComponent;
  let fixture: ComponentFixture<AllGpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllGpsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllGpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

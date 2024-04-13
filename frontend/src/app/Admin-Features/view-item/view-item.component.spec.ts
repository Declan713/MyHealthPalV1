import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItemComponent } from './view-item.component';

describe('ViewItemComponent', () => {
  let component: ViewItemComponent;
  let fixture: ComponentFixture<ViewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

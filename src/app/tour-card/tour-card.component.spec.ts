import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourComponent } from './tour-card.component';

describe('TourCardComponent', () => {
  let component: TourComponent;
  let fixture: ComponentFixture<TourComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TourComponent],
    });
    fixture = TestBed.createComponent(TourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

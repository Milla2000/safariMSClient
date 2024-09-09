import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTourImageModalComponent } from './add-tour-image-modal.component';

describe('AddTourImageModalComponent', () => {
  let component: AddTourImageModalComponent;
  let fixture: ComponentFixture<AddTourImageModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTourImageModalComponent]
    });
    fixture = TestBed.createComponent(AddTourImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

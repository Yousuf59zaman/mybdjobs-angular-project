import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateSingleDatePickerComponent } from './date-single-date-picker.component';

describe('DateSingleDatePickerComponent', () => {
  let component: DateSingleDatePickerComponent;
  let fixture: ComponentFixture<DateSingleDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateSingleDatePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateSingleDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

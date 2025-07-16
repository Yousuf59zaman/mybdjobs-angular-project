import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomValidationAlertComponent } from './custom-validation-alert.component';

describe('CustomValidationAlertComponent', () => {
  let component: CustomValidationAlertComponent;
  let fixture: ComponentFixture<CustomValidationAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomValidationAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomValidationAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

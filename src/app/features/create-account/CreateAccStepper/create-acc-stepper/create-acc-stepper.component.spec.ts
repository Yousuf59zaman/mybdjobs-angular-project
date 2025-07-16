import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccStepperComponent } from './create-acc-stepper.component';

describe('CreateAccStepperComponent', () => {
  let component: CreateAccStepperComponent;
  let fixture: ComponentFixture<CreateAccStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAccStepperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

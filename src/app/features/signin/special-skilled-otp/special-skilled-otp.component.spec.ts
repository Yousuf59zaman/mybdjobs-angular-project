import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialSkilledOtpComponent } from './special-skilled-otp.component';

describe('SpecialSkilledOtpComponent', () => {
  let component: SpecialSkilledOtpComponent;
  let fixture: ComponentFixture<SpecialSkilledOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialSkilledOtpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialSkilledOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

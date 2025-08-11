import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordSuccessModalComponent } from './change-password-success-modal.component';

describe('ChangePasswordSuccessModalComponent', () => {
  let component: ChangePasswordSuccessModalComponent;
  let fixture: ComponentFixture<ChangePasswordSuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordSuccessModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

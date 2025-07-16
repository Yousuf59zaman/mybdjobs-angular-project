import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetSuccessfullComponent } from './password-reset-successfull.component';

describe('PasswordResetSuccessfullComponent', () => {
  let component: PasswordResetSuccessfullComponent;
  let fixture: ComponentFixture<PasswordResetSuccessfullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordResetSuccessfullComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordResetSuccessfullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

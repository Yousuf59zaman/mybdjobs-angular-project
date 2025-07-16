import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailCVComponent } from './email-cv.component';

describe('EmailCVComponent', () => {
  let component: EmailCVComponent;
  let fixture: ComponentFixture<EmailCVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailCVComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailCVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

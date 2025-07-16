import { TestBed } from '@angular/core/testing';

import { OtpVerifyService } from './otp-verify.service';

describe('OtpVerifyService', () => {
  let service: OtpVerifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtpVerifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

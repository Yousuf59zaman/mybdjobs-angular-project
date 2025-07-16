import { TestBed } from '@angular/core/testing';

import { EmailCVService } from './email-cv.service';

describe('EmailCVService', () => {
  let service: EmailCVService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailCVService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ResumeEmailService } from './resume-email.service';

describe('ResumeEmailService', () => {
  let service: ResumeEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumeEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

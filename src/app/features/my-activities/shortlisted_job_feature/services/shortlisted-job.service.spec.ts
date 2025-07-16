import { TestBed } from '@angular/core/testing';

import { ShortlistedJobService } from './shortlisted-job.service';

describe('ShortlistedJobService', () => {
  let service: ShortlistedJobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortlistedJobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

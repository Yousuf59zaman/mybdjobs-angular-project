import { TestBed } from '@angular/core/testing';

import { ShortCVService } from './short-cv.service';

describe('ShortCVService', () => {
  let service: ShortCVService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortCVService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

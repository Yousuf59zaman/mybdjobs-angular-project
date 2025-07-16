import { TestBed } from '@angular/core/testing';

import { DetailsCVService } from './details-cv.service';

describe('DetailsCVService', () => {
  let service: DetailsCVService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsCVService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

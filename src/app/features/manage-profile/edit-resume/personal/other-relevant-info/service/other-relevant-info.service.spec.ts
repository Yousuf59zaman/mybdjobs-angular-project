import { TestBed } from '@angular/core/testing';

import { OtherRelevantInfoService } from './other-relevant-info.service';

describe('OtherRelevantInfoService', () => {
  let service: OtherRelevantInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherRelevantInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

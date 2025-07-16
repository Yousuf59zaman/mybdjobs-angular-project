import { TestBed } from '@angular/core/testing';

import { AccomplishmentService } from './accomplishment.service';

describe('AccomplishmentService', () => {
  let service: AccomplishmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccomplishmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

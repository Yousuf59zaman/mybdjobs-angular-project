import { TestBed } from '@angular/core/testing';

import { CareerApplicationInfoServiceService } from './career-application-info-service.service';

describe('CareerApplicationInfoServiceService', () => {
  let service: CareerApplicationInfoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CareerApplicationInfoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

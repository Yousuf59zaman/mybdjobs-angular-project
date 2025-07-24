import { TestBed } from '@angular/core/testing';

import { EmploymentArmyService } from './employment-army.service';

describe('EmploymentArmyService', () => {
  let service: EmploymentArmyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmploymentArmyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

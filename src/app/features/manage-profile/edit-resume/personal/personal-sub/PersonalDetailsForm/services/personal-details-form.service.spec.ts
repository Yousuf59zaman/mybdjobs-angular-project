import { TestBed } from '@angular/core/testing';

import { PersonalDetailsFormService } from './personal-details-form.service';

describe('PersonalDetailsFormService', () => {
  let service: PersonalDetailsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalDetailsFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

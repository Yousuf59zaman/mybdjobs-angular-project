import { TestBed } from '@angular/core/testing';

import { LanguageProficiencyService } from './language-proficiency.service';

describe('LanguageProficiencyService', () => {
  let service: LanguageProficiencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageProficiencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

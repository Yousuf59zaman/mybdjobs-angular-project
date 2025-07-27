import { TestBed } from '@angular/core/testing';

import { ProfilePreferenceService } from './profile-preference.service';

describe('ProfilePreferenceService', () => {
  let service: ProfilePreferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilePreferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

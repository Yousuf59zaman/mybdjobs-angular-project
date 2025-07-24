import { TestBed } from '@angular/core/testing';

import { ChangeUserIdService } from './change-user-id.service';

describe('ChangeUserIdService', () => {
  let service: ChangeUserIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeUserIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

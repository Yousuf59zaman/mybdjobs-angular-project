import { TestBed } from '@angular/core/testing';

import { AccountDeleteService } from './account-delete.service';

describe('AccountDeleteService', () => {
  let service: AccountDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

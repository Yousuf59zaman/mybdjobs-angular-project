import { TestBed } from '@angular/core/testing';

import { EmployerMessageService } from './employer-message.service';

describe('EmployerMessageService', () => {
  let service: EmployerMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployerMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

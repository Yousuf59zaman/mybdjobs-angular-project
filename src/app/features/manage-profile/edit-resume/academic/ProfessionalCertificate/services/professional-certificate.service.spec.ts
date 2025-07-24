import { TestBed } from '@angular/core/testing';

import { ProfessionalCertificateService } from './professional-certificate.service';

describe('ProfessionalCertificateService', () => {
  let service: ProfessionalCertificateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfessionalCertificateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

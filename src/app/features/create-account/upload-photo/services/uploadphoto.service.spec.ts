import { TestBed } from '@angular/core/testing';

import { UploadphotoService } from './uploadphoto.service';

describe('UploadphotoService', () => {
  let service: UploadphotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadphotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { PointRewardService } from './point-reward.service';

describe('PointRewardService', () => {
  let service: PointRewardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointRewardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

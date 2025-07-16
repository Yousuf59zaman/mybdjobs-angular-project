import { TestBed } from '@angular/core/testing';

import { PhysicalObstacleService } from './physical-obstacle.service';

describe('PhysicalObstacleService', () => {
  let service: PhysicalObstacleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhysicalObstacleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

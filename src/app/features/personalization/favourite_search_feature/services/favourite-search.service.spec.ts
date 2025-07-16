import { TestBed } from '@angular/core/testing';

import { FavouriteSearchService } from './favourite-search.service';

describe('FavouriteSearchService', () => {
  let service: FavouriteSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavouriteSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

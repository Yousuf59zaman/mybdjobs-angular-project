import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteSearchComponent } from './favourite-search.component';

describe('FavouriteSearchComponent', () => {
  let component: FavouriteSearchComponent;
  let fixture: ComponentFixture<FavouriteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouriteSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavouriteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

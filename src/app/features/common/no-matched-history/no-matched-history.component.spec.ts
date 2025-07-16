import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoMatchedHistoryComponent } from './no-matched-history.component';

describe('NoMatchedHistoryComponent', () => {
  let component: NoMatchedHistoryComponent;
  let fixture: ComponentFixture<NoMatchedHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoMatchedHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoMatchedHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

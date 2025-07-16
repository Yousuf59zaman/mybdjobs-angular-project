import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDetailsSummaryComponent } from './no-details-training-summary.component';

describe('NoDetailsTrainingSummaryComponent', () => {
  let component: NoDetailsSummaryComponent;
  let fixture: ComponentFixture<NoDetailsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoDetailsSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoDetailsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

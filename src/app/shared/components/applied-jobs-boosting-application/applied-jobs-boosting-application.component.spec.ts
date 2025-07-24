import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedJobsBoostingApplicationComponent } from './applied-jobs-boosting-application.component';

describe('AppliedJobsBoostingApplicationComponent', () => {
  let component: AppliedJobsBoostingApplicationComponent;
  let fixture: ComponentFixture<AppliedJobsBoostingApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppliedJobsBoostingApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppliedJobsBoostingApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

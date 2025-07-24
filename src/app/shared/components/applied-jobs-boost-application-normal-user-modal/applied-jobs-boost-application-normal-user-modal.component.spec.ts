import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedJobsBoostApplicationNormalUserModalComponent } from './applied-jobs-boost-application-normal-user-modal.component';

describe('AppliedJobsBoostApplicationNormalUserModalComponent', () => {
  let component: AppliedJobsBoostApplicationNormalUserModalComponent;
  let fixture: ComponentFixture<AppliedJobsBoostApplicationNormalUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppliedJobsBoostApplicationNormalUserModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppliedJobsBoostApplicationNormalUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

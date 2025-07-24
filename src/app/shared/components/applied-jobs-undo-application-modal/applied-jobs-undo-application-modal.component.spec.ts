import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedJobsUndoApplicationModalComponent } from './applied-jobs-undo-application-modal.component';

describe('AppliedJobsUndoApplicationModalComponent', () => {
  let component: AppliedJobsUndoApplicationModalComponent;
  let fixture: ComponentFixture<AppliedJobsUndoApplicationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppliedJobsUndoApplicationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppliedJobsUndoApplicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppiledJobsNotJoinedModalComponent } from './appiled-jobs-not-joined-modal.component';

describe('AppiledJobsNotJoinedModalComponent', () => {
  let component: AppiledJobsNotJoinedModalComponent;
  let fixture: ComponentFixture<AppiledJobsNotJoinedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppiledJobsNotJoinedModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppiledJobsNotJoinedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

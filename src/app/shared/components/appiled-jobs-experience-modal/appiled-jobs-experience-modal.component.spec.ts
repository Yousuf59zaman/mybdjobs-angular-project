import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppiledJobsExperienceModalComponent } from './appiled-jobs-experience-modal.component';

describe('AppiledJobsExperienceModalComponent', () => {
  let component: AppiledJobsExperienceModalComponent;
  let fixture: ComponentFixture<AppiledJobsExperienceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppiledJobsExperienceModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppiledJobsExperienceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationTrainingComponent } from './education-training.component';

describe('EducationTrainingComponent', () => {
  let component: EducationTrainingComponent;
  let fixture: ComponentFixture<EducationTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationTrainingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

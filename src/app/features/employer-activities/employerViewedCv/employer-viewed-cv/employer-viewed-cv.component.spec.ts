import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerViewedCvComponent } from './employer-viewed-cv.component';

describe('EmployerViewedCvComponent', () => {
  let component: EmployerViewedCvComponent;
  let fixture: ComponentFixture<EmployerViewedCvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerViewedCvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployerViewedCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

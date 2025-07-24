import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalCertificationSummaryComponent } from './professional-certification-summary.component';

describe('ProfessionalCertificationSummaryComponent', () => {
  let component: ProfessionalCertificationSummaryComponent;
  let fixture: ComponentFixture<ProfessionalCertificationSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalCertificationSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalCertificationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentHistoryArmypersonComponent } from './employment-history-armyperson.component';

describe('EmploymentHistoryArmypersonComponent', () => {
  let component: EmploymentHistoryArmypersonComponent;
  let fixture: ComponentFixture<EmploymentHistoryArmypersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploymentHistoryArmypersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmploymentHistoryArmypersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

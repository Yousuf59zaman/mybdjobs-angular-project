import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedjobsBoostApplicationForProComponent } from './appliedjobs-boost-application-for-pro.component';

describe('AppliedjobsBoostApplicationForProComponent', () => {
  let component: AppliedjobsBoostApplicationForProComponent;
  let fixture: ComponentFixture<AppliedjobsBoostApplicationForProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppliedjobsBoostApplicationForProComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppliedjobsBoostApplicationForProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

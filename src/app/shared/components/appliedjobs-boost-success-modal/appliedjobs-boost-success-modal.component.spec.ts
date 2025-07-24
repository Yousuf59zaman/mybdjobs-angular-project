import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedjobsBoostSuccessModalComponent } from './appliedjobs-boost-success-modal.component';

describe('AppliedjobsBoostSuccessModalComponent', () => {
  let component: AppliedjobsBoostSuccessModalComponent;
  let fixture: ComponentFixture<AppliedjobsBoostSuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppliedjobsBoostSuccessModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppliedjobsBoostSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

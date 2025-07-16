import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilityInfoComponent } from './disability-info.component';

describe('DisabilityInfoComponent', () => {
  let component: DisabilityInfoComponent;
  let fixture: ComponentFixture<DisabilityInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisabilityInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisabilityInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

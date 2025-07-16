import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointRewardComponent } from './point-reward.component';

describe('PointRewardComponent', () => {
  let component: PointRewardComponent;
  let fixture: ComponentFixture<PointRewardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointRewardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

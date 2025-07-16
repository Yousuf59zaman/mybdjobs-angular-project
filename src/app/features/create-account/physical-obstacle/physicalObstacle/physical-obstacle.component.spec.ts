import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalObstaclesComponent } from './physical-obstacle.component';

describe('PhysicalObstacleComponent', () => {
  let component: PhysicalObstaclesComponent;
  let fixture: ComponentFixture<PhysicalObstaclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicalObstaclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalObstaclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

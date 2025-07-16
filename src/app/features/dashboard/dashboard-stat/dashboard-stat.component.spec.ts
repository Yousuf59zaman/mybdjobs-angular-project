import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStatComponent } from './dashboard-stat.component';

describe('DashboardStatComponent', () => {
  let component: DashboardStatComponent;
  let fixture: ComponentFixture<DashboardStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

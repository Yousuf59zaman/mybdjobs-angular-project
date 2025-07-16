import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerApplicationInfoComponent } from './career-application-info.component';

describe('CareerApplicationInfoComponent', () => {
  let component: CareerApplicationInfoComponent;
  let fixture: ComponentFixture<CareerApplicationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerApplicationInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerApplicationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

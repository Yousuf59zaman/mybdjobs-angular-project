import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerInterestComponent } from './employer-interest.component';


describe('EmployerInterestComponent', () => {
  let component: EmployerInterestComponent;
  let fixture: ComponentFixture<EmployerInterestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerInterestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployerInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

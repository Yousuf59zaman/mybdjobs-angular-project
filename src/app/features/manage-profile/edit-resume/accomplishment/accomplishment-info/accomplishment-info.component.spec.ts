import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccomplishmentInfoComponent } from './accomplishment-info.component';

describe('AccomplishmentInfoComponent', () => {
  let component: AccomplishmentInfoComponent;
  let fixture: ComponentFixture<AccomplishmentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccomplishmentInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccomplishmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

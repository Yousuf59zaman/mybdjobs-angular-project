import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDetailsComponent } from './no-details.component';

describe('NoDetailsComponent', () => {
  let component: NoDetailsComponent;
  let fixture: ComponentFixture<NoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

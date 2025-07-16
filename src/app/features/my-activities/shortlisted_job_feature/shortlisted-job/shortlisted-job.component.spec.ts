import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortlistedJobComponent } from './shortlisted-job.component';

describe('ShortlistedJobComponent', () => {
  let component: ShortlistedJobComponent;
  let fixture: ComponentFixture<ShortlistedJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortlistedJobComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortlistedJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

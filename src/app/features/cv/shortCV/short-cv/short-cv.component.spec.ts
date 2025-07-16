import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortCvComponent } from './short-cv.component';

describe('ShortCVComponent', () => {
  let component: ShortCvComponent;
  let fixture: ComponentFixture<ShortCvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortCvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

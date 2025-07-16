import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCVComponent } from './details-cv.component';

describe('DetailsCVComponent', () => {
  let component: DetailsCVComponent;
  let fixture: ComponentFixture<DetailsCVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsCVComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsCVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

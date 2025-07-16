import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCvModalComponent } from './video-cv-modal.component';

describe('VideoCvModalComponent', () => {
  let component: VideoCvModalComponent;
  let fixture: ComponentFixture<VideoCvModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCvModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCvModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

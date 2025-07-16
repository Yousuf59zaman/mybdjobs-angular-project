import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCvDeleteWarningModalComponent } from './video-cv-delete-warning-modal.component';

describe('VideoCvDeleteWarningModalComponent', () => {
  let component: VideoCvDeleteWarningModalComponent;
  let fixture: ComponentFixture<VideoCvDeleteWarningModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCvDeleteWarningModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCvDeleteWarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

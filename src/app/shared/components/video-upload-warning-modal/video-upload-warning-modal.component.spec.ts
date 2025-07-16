import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoUploadWarningModalComponent } from './video-upload-warning-modal.component';

describe('VideoUploadWarningModalComponent', () => {
  let component: VideoUploadWarningModalComponent;
  let fixture: ComponentFixture<VideoUploadWarningModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoUploadWarningModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoUploadWarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

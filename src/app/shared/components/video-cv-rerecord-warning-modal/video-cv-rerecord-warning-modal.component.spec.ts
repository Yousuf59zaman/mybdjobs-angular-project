import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCvRerecordWarningModalComponent } from './video-cv-rerecord-warning-modal.component';

describe('VideoCvRerecordWarningModalComponent', () => {
  let component: VideoCvRerecordWarningModalComponent;
  let fixture: ComponentFixture<VideoCvRerecordWarningModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCvRerecordWarningModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCvRerecordWarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

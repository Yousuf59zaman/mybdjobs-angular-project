import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-video-cv-rerecord-warning-modal',
  imports: [],
  templateUrl: './video-cv-rerecord-warning-modal.component.html',
  styleUrl: './video-cv-rerecord-warning-modal.component.scss'
})
export class VideoCvRerecordWarningModalComponent {
  @Input() title: string = 'Are you sure you want to rerecord video?';
  @Input() message: string = 'If you agree, the video has been deleted from your collection and cannot be restored.';
  @Input() okButtonText: string = 'Okay';

  @Output() close = new EventEmitter<void>();
  @Output() okClick = new EventEmitter<void>();

  onOkClick(): void {
    this.okClick.emit();  
  }

  onClose(): void {
    this.close.emit();
  }
}

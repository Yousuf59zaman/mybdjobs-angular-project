import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ModalService } from '../../../core/services/modal/modal.service';
import { VideoCvModalComponent } from '../video-cv-modal/video-cv-modal.component';

@Component({
  selector: 'app-video-cv-delete-warning-modal',
  imports: [],
  templateUrl: './video-cv-delete-warning-modal.component.html',
  styleUrl: './video-cv-delete-warning-modal.component.scss'
})
export class VideoCvDeleteWarningModalComponent {
  @Input() title: string = 'Are you sure you want to delete this video?';
  @Input() message: string = 'If you agree, the video has been deleted from your collection and cannot be restored.';
  @Input() okButtonText: string = 'Okay';

  @Output() close = new EventEmitter<void>();
  @Output() okClick = new EventEmitter<void>();

  onOkClick(): void {
    this.okClick.emit();  // emit event instead of calling parent method directly
  }

  onClose(): void {
    this.close.emit();
  }
  
}


import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ModalService } from '../../../core/services/modal/modal.service';

@Component({
  selector: 'app-video-upload-warning-modal',
  imports: [],
  templateUrl: './video-upload-warning-modal.component.html',
  styleUrl: './video-upload-warning-modal.component.scss'
})
export class VideoUploadWarningModalComponent {

  @Input() title: string = 'Video Upload Warning';
   @Input() message: string = "Your video is too big to upload. Please make sure it's in 9:16 or 16:9 size and under 100 MB.";
  @Output() close = new EventEmitter<void>();
   @Input() okButtonText: string = 'Okey';
  @Output() okClick = new EventEmitter<void>();
  private modalService = inject(ModalService);

  onOkClick(): void {
    this.okClick.emit();
  }

 onClose() {

  this.modalService.closeModal();
}

}

import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ModalService } from '../../../core/services/modal/modal.service';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-appliedjobs-boost-success-modal',
   imports: [TranslocoModule],
   providers: [provideTranslocoScope('appliedJobs')],
  templateUrl: './change-password-success-modal.component.html',
  styleUrl: './change-password-success-modal.component.scss'
})
export class ChangePasswordSuccessModalComponent {
  @Input() title: string = 'Success';
  @Input() description: string = 'Your password has been updated successfully.';
  @Input() confirmText: string = 'Done';
  @Input() avatarSrc: string = 'images/tikmark.svg';
  @Input() closeSrc: string = 'https://cdn.builder.io/api/v1/image/assets/TEMP/a44198589ca52d78e53ed7751b4de8acb0c71314?placeholderIfAbsent=true&apiKey=410b526392064503a6bea6dba214136e';
  
    @Output() close = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<void>();
    private modalService = inject(ModalService);
  
    modalId: string = Math.random().toString(36).substr(2, 9);
  
    handleCancel(): void {
      this.modalService.closeModal();
    }
  
    handleConfirm(): void {
      this.modalService.closeModal();
    }

}

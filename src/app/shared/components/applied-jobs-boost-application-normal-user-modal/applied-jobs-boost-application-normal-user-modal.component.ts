import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ModalService } from '../../../core/services/modal/modal.service';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-applied-jobs-boost-application-normal-user-modal',
  imports: [ TranslocoModule],
  providers: [provideTranslocoScope('appliedJobs')],
  templateUrl: './applied-jobs-boost-application-normal-user-modal.component.html',
  styleUrl: './applied-jobs-boost-application-normal-user-modal.component.scss'
})
export class AppliedJobsBoostApplicationNormalUserModalComponent {
   @Input() title: string = 'Do you want to boost your application?';
   @Input() description: string =
      'Subscription will allow you to enjoy  this exclusive feature. ';
    @Input() cancelText: string = 'No, Keep It';
    @Input() confirmText: string = 'Yes, Continue';
    @Input() avatarSrc: string =
      'images/applied-jobs-normal-user.svg';
    
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

import { Component, EventEmitter, inject, Inject, Input, Output } from '@angular/core';
import { ModalService } from '../../../core/services/modal/modal.service';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-applied-jobs-boosting-application',
  imports: [ TranslocoModule],
  providers: [provideTranslocoScope('appliedJobs')],
  templateUrl: './applied-jobs-boosting-application.component.html',
  styleUrl: './applied-jobs-boosting-application.component.scss',
})
export class AppliedJobsBoostingApplicationComponent {
  @Input() title: string = 'You are not eligible to boosting';
  @Input() description: string =
    'Your profile needs to be at least 60% match with the posted job';
  @Input() cancelText: string = 'Cancel';
  @Input() confirmText: string = 'Done';
  @Input() avatarSrc: string =
    'https://cdn.builder.io/api/v1/image/assets/TEMP/16637eacb26fb55f4a83ff073da9b84a125c6a67?placeholderIfAbsent=true&apiKey=410b526392064503a6bea6dba214136e';
  @Input() closeSrc: string =
    'https://cdn.builder.io/api/v1/image/assets/TEMP/a44198589ca52d78e53ed7751b4de8acb0c71314?placeholderIfAbsent=true&apiKey=410b526392064503a6bea6dba214136e';

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

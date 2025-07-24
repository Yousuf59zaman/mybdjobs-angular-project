import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ModalService } from '../../../core/services/modal/modal.service';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { CareerApplicationInfoServiceService } from '../../../features/my-activities/applied-jobs/services/careerApplicationInfo.service';

@Component({
  selector: 'app-applied-jobs-undo-application-modal',
    imports: [CommonModule, TranslocoModule],
  providers: [provideTranslocoScope('appliedJobs')],
  templateUrl: './applied-jobs-undo-application-modal.component.html',
  styleUrls: ['./applied-jobs-undo-application-modal.component.scss'],
})
export class AppliedJobsUndoApplicationModalComponent {
  @Input() jobId!: string;
  @Input() userGuid!: string;
  @Input() title: string = 'Undo Application!';
  @Input() description: string =
    'Are you sure you want to undo this application?';
  @Input() confirmText: string = 'Done';
  @Input() cancelText: string = 'Cancel';
  @Input() avatarSrc: string = 'images/appliesjobsundoapp.svg';
  @Output() applicationCancelled = new EventEmitter<void>();
  @Output() cancellationFailed = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  isLoading = false;
  error: string | null = null;
  private modalService = inject(ModalService);
  private careerService = inject(CareerApplicationInfoServiceService);

  handleConfirm(): void {
    if (!this.userGuid || !this.jobId) {
      this.error = `Missing required information: ${
        !this.userGuid ? 'UserGuid' : ''
      } ${!this.jobId ? 'JobId' : ''}`;
      console.error(this.error);
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.careerService
      .cancelApplication(this.userGuid, this.jobId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.confirm.emit();
          this.modalService.closeModal();
          this.applicationCancelled.emit(); 
        },
        error: (err) => {
          this.error = 'Failed to undo application. Please try again.';
          console.error('Error undoing application:', err);
          this.cancellationFailed.emit(); 
        },
      });
  }

  handleCancel(): void {
    this.modalService.closeModal();
  }
}

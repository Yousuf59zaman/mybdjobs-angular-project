import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ModalService } from '../../../core/services/modal/modal.service';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { CareerApplicationInfoServiceService } from '../../../features/my-activities/applied-jobs/services/careerApplicationInfo.service';


@Component({
  selector: 'app-appliedjobs-boost-application-for-pro',
  imports: [TranslocoModule],
  providers: [provideTranslocoScope('appliedJobs')],
  templateUrl: './appliedjobs-boost-application-for-pro.component.html',
  styleUrls: ['./appliedjobs-boost-application-for-pro.component.scss']
})
export class AppliedjobsBoostApplicationForProComponent {
  @Input() title: string = 'Your monthly boosting limit is over!';
  @Input() description: string = 'Your Boosting Limit: 10/10 (Monthly)';
  @Input() confirmText: string = 'Close';
  @Input() avatarSrc: string = 'images/boostlimiticon.svg';
  @Input() jobId!: number;  // Add jobId input
  @Input() userGuid!: string;  // Add userGuid input
  
  @Output() boostSuccess = new EventEmitter<void>();
  modalId: string = Math.random().toString(36).substr(2, 9);
  
  private modalService = inject(ModalService);
  private careerService = inject(CareerApplicationInfoServiceService);
  
  isLoading = false;

  handleCancel(): void {
    this.modalService.closeModal();
  }

  handleConfirm(): void {
    this.isLoading = true;
    
    const payload = {
      userGuid: this.userGuid,
      jobId: this.jobId,
      packageId: 2  // Assuming fixed package ID as per your example
    };
    
    this.careerService.boostJob(payload).subscribe({
      next: (response) => {
        this.modalService.closeModal();
        this.boostSuccess.emit();
      },
      error: (error) => {
        console.error('Error boosting job:', error);
        this.isLoading = false;
        // Handle error (show error message, etc.)
      }
    });
  }
}
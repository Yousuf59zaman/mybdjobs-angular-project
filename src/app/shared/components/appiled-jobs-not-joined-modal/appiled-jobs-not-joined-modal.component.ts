import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../core/services/modal/modal.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { CareerApplicationInfoServiceService } from '../../../features/my-activities/applied-jobs/services/careerApplicationInfo.service';

@Component({
  selector: 'app-appiled-jobs-not-joined-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,TranslocoModule],
  providers: [provideTranslocoScope('appliedJobs')],
  templateUrl: './appiled-jobs-not-joined-modal.component.html',
  styleUrls: ['./appiled-jobs-not-joined-modal.component.scss']
})

export class AppiledJobsNotJoinedModalComponent {
  @Input() userGuid: string = '';
  @Input() jobId: number = 0;
  @Output() closed = new EventEmitter<void>();
  @Output() reasonSelected = new EventEmitter<number>(); 

  private modalService = inject(ModalService);
  private careerService = inject(CareerApplicationInfoServiceService);

  feedbackOptions = [
    { id: '1', label: 'Not interested to work in the organization', value: 1 },
    { id: '2', label: 'The office is far away from my residence', value: 2 },
    { id: '3', label: 'I am already employed and do not want to switch job', value: 3 },
    { id: '4', label: 'Others', value: 4 }
  ];

  selectedReason: number | undefined = undefined; 

  ngOnInit() {
    if (!this.userGuid || !this.jobId) {
      console.error('Missing required inputs:', { 
        userGuid: this.userGuid, 
        jobId: this.jobId 
      });
      alert('Cannot open modal: Missing user or job details.');
    }
  }

  onReasonChange(value: number): void {
    // Removed for production
    this.selectedReason = value;
  }

onSubmit(): void {
  // Removed for production
  if (this.selectedReason !== undefined && this.userGuid && this.jobId) {
    const payload = {
      userGuid: this.userGuid,
      jobId: this.jobId,
      experienceId: 0,
      status: 0,
      reasonId: this.selectedReason,
      reasonPackage: "",
      responseType: 4 
    };
    // Removed for production

    this.careerService.updateJobStatus(payload).subscribe({
      next: (response) => {
        // Removed for production
        this.reasonSelected.emit(this.selectedReason);
        this.modalService.closeModal();
        this.closed.emit(); // This triggers the parent's closed callback
      },
      error: (error) => {
        console.error('Failed to update Not Joined status:', error);
        alert('Failed to update status. Please try again.');
      }
    });
  } else {
    console.warn('Submission failed: Invalid inputs', {
      selectedReason: this.selectedReason,
      userGuid: this.userGuid,
      jobId: this.jobId
    });
    alert('Please select a reason and ensure job details are provided.');
  }
}

onClose(): void {
  // Removed for production
  this.modalService.closeModal();
  this.closed.emit(); // This triggers the parent's closed callback
}







  
}
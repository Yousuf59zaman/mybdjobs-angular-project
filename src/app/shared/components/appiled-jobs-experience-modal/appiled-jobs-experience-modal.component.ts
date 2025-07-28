import { Component, EventEmitter, Inject, inject, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../core/services/modal/modal.service';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { ExperienceData } from '../../../features/my-activities/applied-jobs/models/appliedJobs.model';
import { CareerApplicationInfoServiceService } from '../../../features/my-activities/applied-jobs/services/careerApplicationInfo.service';

@Component({
  selector: 'app-appiled-jobs-experience-modal',
  standalone: true,
   imports: [CommonModule, FormsModule, TranslocoModule],
  providers: [provideTranslocoScope('appliedJobs')],
  templateUrl: './appiled-jobs-experience-modal.component.html',
  styleUrl: './appiled-jobs-experience-modal.component.scss'
})
export class AppiledJobsExperienceModalComponent {
  @Input() experiences: ExperienceData[] = [];
  @Input() jobTitle: string = '';
  
  @Output() experienceSelected = new EventEmitter<string>();
  @Output() submitClicked = new EventEmitter<string>();
  @Output() closeClicked = new EventEmitter<void>();
  @Output() addExperienceClicked = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  selectedExperienceId: string | null = null;

  @Input() userGuid: string = '';
  @Input() jobId: number = 0;
  constructor(
  private modalService: ModalService,
  private careerService: CareerApplicationInfoServiceService,

) {}

  trackByExperienceId(index: number, experience: ExperienceData): string {
    return experience.experience_ID.toString();
  }

 onExperienceSelected(experienceId: string): void {
  // Removed for production
  this.selectedExperienceId = experienceId;
  this.experienceSelected.emit(experienceId);
}


onSubmitClick(): void {
    if (this.selectedExperienceId) {
      const payload = {
        userGuid: this.userGuid,
        jobId: this.jobId,
        experienceId: Number(this.selectedExperienceId),
        status: 0,
        reasonId: 0,
        reasonPackage: "",
        responseType: 3 
      };

      this.careerService.updateJobStatus(payload).subscribe({
        next: () => {
          this.modalService.closeModal();
          this.closed.emit();
        },
        error: (err) => console.error('Error updating status:', err)
      });
    }
  }

  onCloseClick(): void {
    this.modalService.closeModal();
  }

  onAddExperienceClick(): void {
    this.addExperienceClicked.emit();
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'Present';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
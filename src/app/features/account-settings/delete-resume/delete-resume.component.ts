import {
  Component, inject, signal, ViewChildren, ElementRef, QueryList, OnInit
} from '@angular/core';

import { NumericOnlyDirective } from '../../../core/directives/numeric-only.dir';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalService } from '../../../core/services/confirmationModal/confirmation-modal.service';
import { DeleteResumeService } from './service/delete-resume.service';
import { DeleteResumeQuery } from './model/delete-resume';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-resume',
  imports: [NumericOnlyDirective, FormsModule, CommonModule],
  templateUrl: './delete-resume.component.html',
  styleUrl: './delete-resume.component.scss'
})
export class DeleteResumeComponent implements OnInit {
  showPassword = false;
  trackByIndex(index: number) { return index; }
  private deleteResumeService = inject(DeleteResumeService);
  // Bound properties for form inputs
  password: string = '';
  reason: string = '';
  private toastr = inject(ToastrService);
  private confirmModal = inject(ConfirmationModalService);

  profileUsername = signal('YousufTest');

  // ===== OTP state =====
  otp: string[] = Array(6).fill('');
  @ViewChildren('otpBox') otpBoxes!: QueryList<ElementRef<HTMLInputElement>>;
  timerSeconds = signal(30);
  private timerId?: any;

  ngOnInit(): void {
    this.startTimer();
  }

  // UI already built earlier
  onClickTogglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Modal from previous step
  onClickConfirmDelete() {
    this.confirmModal.openModal({
      content: {
        title: 'Are you sure you want to Delete this Resume?',
        content:
          'If you agree, the resume will be removed from your collection and cannot be restored.',
        closeButtonText: 'No, Keep it',
        saveButtonText: 'Yes, Continue',
        isCloseButtonVisible: true,
        isSaveButtonVisible: true
      }
    })
      .subscribe(({ event }) => {
        if (event?.isConfirm) {
          this.deleteResume();            // <- proceed with API call
        } else {
          this.toastr.info('Deletion cancelled.');
        }
      });
  }

  // ===== OTP handlers =====
  onOtpInput(e: Event, i: number) {
    const el = e.target as HTMLInputElement;
    const v = (el.value || '').replace(/\D/g, '').slice(0, 1);
    // write to model only
    this.otp[i] = v;
    // ensure the view shows the model
    el.value = v;
    if (v && i < this.otp.length - 1) {
      // defer focus so repeated key events don't type in the next box
      setTimeout(() => this.focusBox(i + 1), 0);
    }
  }

  onOtpKeydown(e: KeyboardEvent, i: number) {
    const el = e.target as HTMLInputElement;
    const isDigit = /^\d$/.test(e.key);

    if (isDigit && el.value) {
      // replace the current value and move to the next box
      e.preventDefault();
      this.otp[i] = e.key;
      el.value = e.key;
      if (i < this.otp.length - 1) setTimeout(() => this.focusBox(i + 1), 0);
      return;
    }

    if (e.key === 'Backspace' && !el.value && i > 0) {
      e.preventDefault();
      this.otp[i - 1] = '';
      this.focusBox(i - 1);
    } else if (e.key === 'ArrowLeft' && i > 0) {
      this.focusBox(i - 1);
    } else if (e.key === 'ArrowRight' && i < this.otp.length - 1) {
      this.focusBox(i + 1);
    }
  }

  private focusBox(index: number) {
    const ref = this.otpBoxes.get(index);
    ref?.nativeElement.focus();
    ref?.nativeElement.select();
  }

  private startTimer() {
    this.timerSeconds.set(30);
    clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      const left = this.timerSeconds() - 1;
      this.timerSeconds.set(Math.max(left, 0));
      if (left <= 0) clearInterval(this.timerId);
    }, 1000);
  }

  onResendCode() {
    if (this.timerSeconds() > 0) return;
    // TODO: call resend API here
    this.toastr.success('Code resent.');
    this.otp = Array(6).fill('');
    this.startTimer();
    setTimeout(() => this.focusBox(0)); // focus first box again
  }

  onClickVerify() {
    const code = this.otp.join('');
    if (code.length !== 6) {
      this.toastr.error('Please enter the 6‑digit code.');
      return;
    }
    // TODO: verify code via API
    this.toastr.success('Code verified. Proceeding…');
  }

  // ===== From previous step (kept for completeness) =====
  private deleteResume() {
    const query: DeleteResumeQuery = {
      UserGuid: 'YiLzZxZuPiCyIFU6Bb00ITBbMTDbIRLyZiS1ZTZ3PEc0PRg6BFPtBFU7d7kRZ7U=',
      UserName: 'YousufTest',
      Password: this.password,
      Reason: this.reason
    };
    this.deleteResumeService.deleteResume(query).subscribe({
      next: (response) => {
        // this.toastr.success('Resume deleted successfully.');
        this.openSuccessModal();
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Deletion failed.');
      }
    });
  }

  /** Modal that looks like the provided screenshot */
  private openSuccessModal() {
    this.confirmModal.openModal({
      content: {
        title: 'Your Resume Delete Successfully.',
        content:
          "You've deleted your resume from your Bdjobs profile. Employers can no longer view or access it.",
        closeButtonText: 'Okay',
        saveButtonText: '',
        isCloseButtonVisible: true,
        isSaveButtonVisible: false
      }
    }).subscribe(() => {
      // Optional: redirect or refresh state after user clicks "Okay"
      // this.router.navigate(['/jobseeker-panel']);
    });
  }

  onKeepResume() {
    // go back or simply notify
    this.toastr.info('Keeping your resume. No changes made.');
    // e.g., navigate back or set your previous step here
    // this.router.navigate(['/jobseeker-panel']);
  }

  onContinueDeletion() {
    // If your flow goes to OTP next, trigger that here.
    // Or show your existing confirmation modal if you prefer.
    // Example: open OTP step route/signal OR reuse modal:
    this.confirmModal.openModal({
      content: {
        title: 'Final confirmation',
        content: 'Do you want to proceed with deleting your resume?',
        closeButtonText: 'No, Keep It',
        saveButtonText: 'Yes, Delete',
        isCloseButtonVisible: true,
        isSaveButtonVisible: true
      }
    }).subscribe(({ event }) => {
      if (event?.isConfirm) {
        // proceed to OTP or call delete API
        this.toastr.success('Proceeding…');
        // e.g. this.step.set('otp');  or this.deleteResume();
      }
    });
  }
}

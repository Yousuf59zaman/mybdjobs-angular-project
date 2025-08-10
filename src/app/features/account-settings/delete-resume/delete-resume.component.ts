import {
  Component, inject, signal, ViewChildren, ElementRef, QueryList, OnInit, OnDestroy
} from '@angular/core';

import { NumericOnlyDirective } from '../../../core/directives/numeric-only.dir';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalService } from '../../../core/services/confirmationModal/confirmation-modal.service';
import { DeleteResumeService } from './service/delete-resume.service';
import { DeleteResumeQuery } from './model/delete-resume';
import { SendOtpRequest, DeleteResumeOtpQuery } from './model/delete-resume';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../signin/services/login.service';
import { CookieService } from '../../../core/services/cookie/cookie.service';

@Component({
  selector: 'app-delete-resume',
  imports: [NumericOnlyDirective, FormsModule, CommonModule],
  templateUrl: './delete-resume.component.html',
  styleUrl: './delete-resume.component.scss'
})
export class DeleteResumeComponent implements OnInit, OnDestroy {
  showPassword = false;
  trackByIndex(index: number) { return index; }

  private deleteResumeService = inject(DeleteResumeService);
  private loginService = inject(LoginService);
  private cookieService = inject(CookieService);
  private toastr = inject(ToastrService);
  private confirmModal = inject(ConfirmationModalService);

  // Bound properties for form inputs
  password: string = '';
  reason: string = '';
  phoneNumber: string = '';

  profileUsername = signal('YousufTest');

  // User info
  isBlueCaller = signal<boolean>(true);
  userGuid: string = "YiLzZxZuPiCyIFU6Bb00ITBbMTDbIRLyZiS1ZTZ3PEc0PRg6BFPtBFU7d7kRZ7U=";
  isLoading = signal(true);

  // Static values for BlueCollar users as specified
  private blueCollarUserGuid = 'YlG0IRUxZiZyPxPhYb00BEBjMTG6YiLyBlU7PlY6IEdzPiDbBFPtBFVnRRVZBUw=';
  private blueCollarUserName = '01604226197';

  // Flow control signals
  currentStep = signal<'initial' | 'otp' | 'confirmation'>('initial');

  // ===== OTP state =====
  otp: string[] = Array(6).fill('');
  @ViewChildren('otpBox') otpBoxes!: QueryList<ElementRef<HTMLInputElement>>;
  timerSeconds = signal(120); // Start with 2 minutes
  private timerId?: any;

  ngOnInit(): void {
    this.loadUserInfo();
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private loadUserInfo(): void {
    const authData = this.loginService.getAuthData();

    if (authData) {
      //this.IsBdjobsPro = authData.isBdjobsPro.toString();
      // this.loadSupportingInfo(authData.token);
      this.loginService.getSupportingInfo(authData.token).subscribe({
        next: (response) => {
          console.log('User Info Response:', response);
          this.extractUserInfo(response);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading user info:', err);
          this.isLoading.set(false);
        }
      });
      return;
    }

    const token = this.cookieService.getCookie('AccessTokenForJobseeker');
    console.log(token)
    const rawGuid = this.cookieService.getCookie('MybdjobsGId');
    console.log('User Guid:', this.userGuid);
    if (!token || !this.userGuid) {
      this.isLoading.set(false);
      return;
    }

    this.loginService.getSupportingInfo(token).subscribe({
      next: (response) => {
        console.log('User Info Response:', response);
        this.extractUserInfo(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading user info:', err);
        this.isLoading.set(false);
      }
    });
  }

  private extractUserInfo(response: any): void {
    console.log('Extracting user info from response:', response);
    if (response?.event?.eventType === 1) {
      console.log('Response Event:', response.event);
      const currentUser = response.event.eventData?.[0]?.value?.currentUser;
      if (currentUser) {
        console.log('Current User:', currentUser);
        console.log('is BlueCollar:', currentUser.isBlueCaller);
        this.isBlueCaller.set(true);
        this.profileUsername.set(currentUser.username || 'User');
        this.userGuid = currentUser.guid;

        // Store auth data if not already stored
        this.loginService.setAuthData(response);
      }
    }
  }

  // UI already built earlier
  onClickTogglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Modal from previous step
  onClickConfirmDelete() {
    // Validate inputs based on user type
    if (!this.isBlueCaller()) {
      // White collar validation
      if (!this.password || !this.reason) {
        this.toastr.error('Please fill in all required fields.');
        return;
      }
    } else {
      // Blue collar validation
      if (!this.phoneNumber) {
        this.toastr.error('Please enter your phone number.');
        return;
      }
    }

    // For BlueCollar users, directly call the OTP API
    if (this.isBlueCaller()) {
      this.isLoading.set(true);

      const request: SendOtpRequest = {
        userGuid: this.blueCollarUserGuid,
        userName: this.blueCollarUserName,
        isForDeleteResume: true
      };

      this.deleteResumeService.sendOtpForDeleteResume(request).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.currentStep.set('otp');
          this.startTimer();
          // Focus on the first OTP input box after view renders
          setTimeout(() => this.focusBox(0), 100);
          this.toastr.success('Verification code sent successfully.');
        },
        error: (error) => {
          this.isLoading.set(false);
          this.toastr.error('Failed to send verification code. Please try again.');
          console.error('Error sending OTP:', error);
        }
      });
    } else {
      // Keep existing modal confirmation logic for white collar users
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
            // For white collar, proceed with deletion
            this.deleteResume();
          } else {
            this.toastr.info('Deletion cancelled.');
          }
        });
    }
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
    this.timerSeconds.set(120); // 2 minutes for OTP validity
    clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      const left = this.timerSeconds() - 1;
      this.timerSeconds.set(Math.max(left, 0));
      if (left <= 0) clearInterval(this.timerId);
    }, 1000);
  }

  onResendCode() {
    if (this.timerSeconds() > 0) return;

    this.isLoading.set(true);
    const request: SendOtpRequest = {
      userGuid: this.blueCollarUserGuid,
      userName: this.blueCollarUserName,
      isForDeleteResume: true
    };

    this.deleteResumeService.sendOtpForDeleteResume(request).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.otp = Array(6).fill('');
        this.startTimer();
        this.toastr.success('Code resent successfully.');
        setTimeout(() => this.focusBox(0), 100);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toastr.error('Failed to resend code. Please try again.');
        console.error('Error resending OTP:', error);
      }
    });
  }

  onClickVerify() {
    const code = this.otp.join('');
    if (code.length !== 6) {
      this.toastr.error('Please enter the 6‑digit code.');
      return;
    }

    this.isLoading.set(true);

    const query: DeleteResumeOtpQuery = {
      userGuid: this.blueCollarUserGuid,
      UserName: this.blueCollarUserName,
      OTPCode: code
    };

    this.deleteResumeService.verifyOtpAndDeleteResume(query).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.currentStep.set('confirmation');
        this.toastr.success('Code verified successfully.');
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toastr.error('Failed to verify code. Please check and try again.');
        console.error('Error verifying OTP:', error);
      }
    });
  }

  // ===== From previous step (kept for completeness) =====
  private deleteResume() {
    const query: DeleteResumeQuery = {
      UserGuid: this.userGuid || '',
      UserName: this.profileUsername(),
      Password: this.password,
      Reason: this.reason
    };

    this.deleteResumeService.deleteResume(query).subscribe({
      next: (response) => {
        this.openSuccessModal();
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Failed to delete resume. Please try again.');
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
    this.currentStep.set('initial');
  }

  onContinueDeletion() {
    if (this.isBlueCaller()) {
      // For blue collar, we've already verified the OTP, just show success
      this.openSuccessModal();
    } else {
      // For white collar, use existing deleteResume method
      this.deleteResume();
    }
  }
}

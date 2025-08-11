import {
  Component,
  inject,
  signal,
  ViewChildren,
  ElementRef,
  QueryList,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { NumericOnlyDirective } from '../../../core/directives/numeric-only.dir';
import { ToastrService } from 'ngx-toastr';
import { DeleteResumeService } from './service/delete-resume.service';
import { DeleteResumeQuery } from './model/delete-resume';
import { SendOtpRequest, DeleteResumeOtpQuery } from './model/delete-resume';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../signin/services/login.service';
import { CookieService } from '../../../core/services/cookie/cookie.service';
import {
  SocialAuthService,
  GoogleLoginProvider,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-resume',
  imports: [
    NumericOnlyDirective,
    FormsModule,
    CommonModule,
    GoogleSigninButtonModule,
  ],
  templateUrl: './delete-resume.component.html',
  styleUrl: './delete-resume.component.scss',
})
export class DeleteResumeComponent implements OnInit, OnDestroy {
  showPassword = false;
  trackByIndex(index: number) {
    return index;
  }

  private deleteResumeService = inject(DeleteResumeService);
  private loginService = inject(LoginService);
  private cookieService = inject(CookieService);
  private toastr = inject(ToastrService);
  private socialAuthService = inject(SocialAuthService);
  private http = inject(HttpClient);

  private socialAuthSub?: Subscription;
  password: string = '';
  reason: string = '';
  phoneNumber: string = '';

  profileUsername = signal('YousufTest');
  hasSocialMedia = signal<boolean | null>(null);
  showConfirmModal = signal(false);
  showSuccessModal = signal(false);
  isBlueCaller = signal<boolean>(true);
  userGuid: string =
    'YRPhBiG0BlZyYRhbYb00IFJjMRc7YTGyIFDbPFZxIEJiZRg7BFPtBFVUIGL3Ung=';
  isLoading = signal(true);
  private blueCollarUserGuid =
    'YlG0IRUxZiZyPxPhYb00BEBjMTG6YiLyBlU7PlY6IEdzPiDbBFPtBFVnRRVZBUw=';
  private blueCollarUserName = '01604226197';
  currentStep = signal<'initial' | 'otp' | 'confirmation'>('initial');
  otp: string[] = Array(6).fill('');
  @ViewChildren('otpBox') otpBoxes!: QueryList<ElementRef<HTMLInputElement>>;
  timerSeconds = signal(120);
  private timerId?: any;
  private otpCode: string = '';

  ngOnInit(): void {
    this.loadUserInfo();
    this.startTimer();
    this.socialAuthSub = this.socialAuthService.authState.subscribe(
      (result) => {
        if (!result) return;
        const email = (result as any).email;
        if (!email) {
          this.toastr.error('Google sign-in did not return an email.');
          return;
        }
        const deleteQuery: DeleteResumeQuery = {
          UserGuid: this.userGuid,
          UserName: email,
          IsSocialMedia: 1,
          SocialMediaType: 'Google',
        };
        this.isLoading.set(true);
        this.deleteResumeService.deleteResume(deleteQuery).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.toastr.success('Resume deleted via Google sign-in.');
            this.openSuccessModal();
            this.currentStep.set('confirmation');
          },
          error: (err) => {
            this.toastr.error('Failed to delete resume after Google sign-in.');
            this.isLoading.set(false);
          },
        });
      },
    );
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.socialAuthSub?.unsubscribe();
  }

  private loadUserInfo(): void {
    const authData = this.loginService.getAuthData();

    if (authData) {
      this.loginService.getSupportingInfo(authData.token).subscribe({
        next: (response) => {
          this.extractUserInfo(response);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
        },
      });
      return;
    }

    const token = this.cookieService.getCookie('AccessTokenForJobseeker');
    if (!token || !this.userGuid) {
      this.isLoading.set(false);
      return;
    }

    this.loginService.getSupportingInfo(token).subscribe({
      next: (response) => {
        this.extractUserInfo(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
      },
    });
  }

  private extractUserInfo(response: any): void {
    if (response?.event?.eventType === 1) {
      const currentUser = response.event.eventData?.[0]?.value?.currentUser;
      if (currentUser) {
        this.isBlueCaller.set(!!currentUser.isBlueCaller);
        this.profileUsername.set(
          currentUser.username || currentUser.email || 'User',
        );
        this.userGuid = currentUser.guid;
        this.hasSocialMedia.set(
          currentUser.socialMedia !== null &&
            currentUser.socialMedia !== undefined,
        );
        this.loginService.setAuthData(response);
      }
    }
  }
  onClickTogglePassword() {
    this.showPassword = !this.showPassword;
  }
  onClickConfirmDelete() {
    if (!this.isBlueCaller()) {
      if (!this.password || !this.reason) {
        this.toastr.error('Please fill in all required fields.');
        return;
      }
      this.showConfirmModal.set(true);
      return;
    } else {
      if (!this.phoneNumber) {
        this.toastr.error('Please enter your phone number.');
        return;
      }
      this.isLoading.set(true);

      const request: SendOtpRequest = {
        userGuid: this.blueCollarUserGuid,
        userName: this.blueCollarUserName,
        isForDeleteResume: true,
      };

      this.deleteResumeService.sendOtpForDeleteResume(request).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.currentStep.set('otp');
          this.startTimer();
          setTimeout(() => this.focusBox(0), 100);
          this.toastr.success('Verification code sent successfully.');
        },
        error: (error) => {
          this.isLoading.set(false);
          this.toastr.error(
            'Failed to send verification code. Please try again.',
          );
        },
      });
    }
  }
  onOtpInput(e: Event, i: number) {
    const el = e.target as HTMLInputElement;
    const v = (el.value || '').replace(/\D/g, '').slice(0, 1);
    this.otp[i] = v;
    el.value = v;
    if (v && i < this.otp.length - 1) {
      setTimeout(() => this.focusBox(i + 1), 0);
    }
  }

  onOtpKeydown(e: KeyboardEvent, i: number) {
    const el = e.target as HTMLInputElement;
    const isDigit = /^\d$/.test(e.key);

    if (isDigit && el.value) {
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
    this.timerSeconds.set(120);
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
      isForDeleteResume: true,
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
      },
    });
  }

  onClickVerify() {
    const code = this.otp.join('');
    if (code.length !== 6) {
      this.toastr.error('Please enter a valid 6-digit verification code.');
      return;
    }
    this.otpCode = code;
    this.currentStep.set('confirmation');
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.toastr.success('Code captured. Please confirm deletion.');
  }
  private deleteResume() {
    const query: DeleteResumeQuery = {
      UserGuid: this.userGuid || '',
      UserName: this.profileUsername(),
      Password: this.password,
      Reason: this.reason,
    };

    this.deleteResumeService.deleteResume(query).subscribe({
      next: (response) => {
        this.openSuccessModal();
      },
      error: (error) => {
        this.toastr.error('Failed to delete resume. Please try again.');
      },
    });
  }

  private openSuccessModal() {
    this.showSuccessModal.set(true);
    this.password = '';
    this.reason = '';
    this.phoneNumber = '';
  }

  closeSuccessModal() {
    this.showSuccessModal.set(false);
  }

  onKeepResume() {
    this.toastr.info('Keeping your resume. No changes made.');
    this.currentStep.set('initial');
  }

  onContinueDeletion() {
    if (this.isBlueCaller()) {
      if (!this.otpCode || this.otpCode.length !== 6) {
        this.toastr.error(
          'Missing or invalid OTP. Please restart the process.',
        );
        return;
      }
      const query: DeleteResumeOtpQuery & { Reason?: string } = {
        userGuid: this.blueCollarUserGuid,
        UserName: this.blueCollarUserName,
        OTPCode: this.otpCode,
        Reason: this.reason || undefined,
      };
      this.isLoading.set(true);
      this.deleteResumeService.verifyOtpAndDeleteResume(query).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.openSuccessModal();
        },
        error: (error) => {
          this.isLoading.set(false);
          this.toastr.error('Failed to delete resume. Please try again.');
        },
      });
    } else {
      this.deleteResume();
    }
  }
  signInWithGoogle(): void {
    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => {})
      .catch((err) => {
        this.toastr.error('Unable to start Google sign-in.');
      });
  }
  cancelDelete() {
    this.showConfirmModal.set(false);
    this.toastr.info('Deletion cancelled.');
  }

  confirmDelete() {
    this.showConfirmModal.set(false);
    this.deleteResume();
  }
}

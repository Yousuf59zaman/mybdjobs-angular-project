import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { LoginService, productionEnvironment } from '../../signin/services/login.service';
import { SharedService } from '../../signin/services/share.service';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ChangePasswordSuccessModalComponent } from '../../../shared/components/change-password-success-modal/change-password-success-modal.component';
import { ModalService } from '../../../core/services/modal/modal.service';
import { ChangePasswordService } from './service/change-password.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { ChangePasswordRequest } from './models/change-password.model';
import { CookieService } from '../../../core/services/cookie/cookie.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule, InputComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  private translocoService = inject(TranslocoService);
  private loginService = inject(LoginService);
  private sharedService = inject(SharedService);
  private modalService = inject(ModalService);
  private changepasswordService = inject(ChangePasswordService);
  private cookieService = inject(CookieService);
  private http = inject(HttpClient);
  
  currentPasswordType = signal<'text' | 'password'>('password');
  newPasswordType = signal<'text' | 'password'>('password');
  confirmPasswordType = signal<'text' | 'password'>('password');
  submitted = signal(false);
  isPasswordEmpty = signal(false);
  isOldPasswordMatch = signal(false);
  currentLang = signal(this.translocoService.getActiveLang());
  readonly apiError = signal('');
  showOtpVerification = signal(false);
  showPasswordForm = signal(true);
  userEmail = signal('');
  targetEmail = signal('');
  codeValues = signal<string[]>(['', '', '', '', '', '']);
  hasError = signal(false);
  errorMessage = signal('');
  isLoading = signal(false);
  timeLeft = signal(30);

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  noPasswordForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  private tokenRefreshInterval: any;
  private readonly REFRESH_INTERVAL = 20 * 1000; 

  constructor() {
    this.newPasswordControl().valueChanges.subscribe(() => {
      this.submitted.set(false);
      this.isPasswordEmpty.set(false);
      this.apiError.set('');
    });

    this.confirmPasswordControl().valueChanges.subscribe(() => {
      this.submitted.set(false);
      this.isPasswordEmpty.set(false);
      this.apiError.set('');
    });
  }

  currentPasswordControl = computed(() =>
    this.hasAnyPassword()
      ? (this.passwordForm.get('currentPassword') as FormControl)
      : new FormControl('')
  );

  newPasswordControl = computed(() =>
    this.hasAnyPassword()
      ? (this.passwordForm.get('newPassword') as FormControl)
      : (this.noPasswordForm.get('newPassword') as FormControl)
  );

  confirmPasswordControl = computed(() =>
    this.hasAnyPassword()
      ? (this.passwordForm.get('confirmPassword') as FormControl)
      : (this.noPasswordForm.get('confirmPassword') as FormControl)
  );

  readonly isPasswordMatch = computed(() => {
    const newPwd = this.newPasswordControl().value;
    const confirmPwd = this.confirmPasswordControl().value;
    return newPwd === confirmPwd && newPwd?.length >= 8 && newPwd?.length <= 15;
  });

  readonly currentUser = computed(() => this.loginService.currentUserInfo());
  readonly hasAnyPassword = computed(
    () => this.currentUser()?.hasAnyPassword ?? true
  );

  ngOnInit(): void {
    this.initializeAuth();
  }

private initializeAuth(): void {
    const existingRefreshToken = this.cookieService.getCookie(productionEnvironment.refreshTokenCookieName);
    
    if (existingRefreshToken) {
      this.refreshAuthToken(existingRefreshToken).subscribe({
        next: (response) => {
          if (response.event.eventType === 1) {
            this.handleTokenRefreshResponse(response);
            this.loadSupportingInfo();
          }
        },
        error: (error) => {
          console.error('Token refresh failed:', error);
          this.apiError.set('Session expired. Please login again.');
        }
      });
    } else {
      this.apiError.set('Please login first');
    }
  }


  private handleTokenRefreshResponse(response: any): void {
    const newToken = response.event.eventData[0].value.token;
    const newRefreshToken = response.event.eventData[0].value.refreshToken;
    this.cookieService.setCookie(productionEnvironment.authTokenCookieName, newToken, 1);
    this.cookieService.setCookie(productionEnvironment.refreshTokenCookieName, newRefreshToken, 1);
    
    if (this.currentUser()) {
      this.userEmail.set(this.currentUser()?.username || '');
      this.targetEmail.set(this.currentUser()?.email || '');
    }
    
    this.startTokenRefreshTimer(newRefreshToken);
  }

  private startTokenRefreshTimer(refreshToken: string): void {
    this.stopTokenRefreshTimer();
    
    this.tokenRefreshInterval = setInterval(() => {
      this.refreshAuthToken(refreshToken).subscribe({
        next: (response) => {
          if (response.event.eventType === 1) {
            this.handleTokenRefreshResponse(response);
          }
        },
        error: (error) => {
          console.error('Token refresh failed:', error);
          this.stopTokenRefreshTimer();
          this.apiError.set('Session expired. Please login again.');
        }
      });
    }, this.REFRESH_INTERVAL);
  }

  private stopTokenRefreshTimer(): void {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = null;
    }
  }

  private refreshAuthToken(refreshToken: string): Observable<any> {
    return this.http.get<any>(
      `https://gateway.bdjobs.com/bdjobs-auth-dev/api/Login/GetAuthTokenByRefreshToken?refreshToken=${refreshToken}`
    ).pipe(
      catchError(error => {
        console.error('Token refresh API error:', error);
        return throwError(() => error);
      })
    );
  }

  private loadSupportingInfo(): void {
    // Update cookie name to use environment variable
    const authToken = this.cookieService.getCookie(productionEnvironment.authTokenCookieName);
    if (!authToken) {
      this.apiError.set('Authentication token not found');
      return;
    }

    this.callSupportingInfoJobseeker(authToken);
  }

  private callSupportingInfoJobseeker(token: string): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<any>(
      'https://gateway.bdjobs.com/bdjobs-auth-dev/api/Login/GetSupportingInfoJobseeker',
      { headers }
    ).subscribe({
      next: (response) => {
        if (response.event.eventType === 1) {
          this.loginService.currentUserInfo.set(
            response.event.eventData[0].value.currentUser
          );
        }
      },
      error: (error) => {
        console.error('Error loading user info:', error);
      }
    });
  }

  passwordValidation(value: string = ''): string {
    if (!value || typeof value !== 'string') return '';

    if (value.length >= 8 && value.length < 16) {
      const hasCapital = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSmaller = /[a-z]/.test(value);
      const hasSpecial = /[^A-Za-z0-9]/.test(value);
      const passedChecks = [
        hasCapital,
        hasNumber,
        hasSmaller,
        hasSpecial,
      ].filter(Boolean).length;

      if (passedChecks === 4) {
        return this.currentLang() === 'en' ? 'strong' : 'শক্তিশালী';
      } else if (passedChecks === 3) {
        return this.currentLang() === 'en' ? 'average' : 'মধ্যম';
      } else {
        return this.currentLang() === 'en' ? 'weak' : 'দুর্বল';
      }
    }

    return '';
  }

  getPasswordStrengthBars(value: string = ''): string[] {
    const level = this.passwordValidation(value);

    switch (level) {
      case 'weak':
      case 'দুর্বল':
        return [
          'bg-[#E42D27]',
          'bg-[#E42D27]',
          'bg-[#D9D9D9]',
          'bg-[#D9D9D9]',
          'bg-[#D9D9D9]',
        ];
      case 'average':
      case 'মধ্যম':
        return [
          'bg-[#FF9F40]',
          'bg-[#FF9F40]',
          'bg-[#FF9F40]',
          'bg-[#FF9F40]',
          'bg-[#D9D9D9]',
        ];
      case 'strong':
      case 'শক্তিশালী':
        return [
          'bg-[#32A071]',
          'bg-[#32A071]',
          'bg-[#32A071]',
          'bg-[#32A071]',
          'bg-[#32A071]',
        ];
      default:
        return [
          'bg-[#D9D9D9]',
          'bg-[#D9D9D9]',
          'bg-[#D9D9D9]',
          'bg-[#D9D9D9]',
          'bg-[#D9D9D9]',
        ];
    }
  }

  hasInvalidChars(): boolean {
    const value = this.newPasswordControl().value;
    return !!value && /[\\%&()<>\s]/.test(value);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    this.apiError.set('');

    if (this.hasAnyPassword()) {
      this.passwordForm.markAllAsTouched();
    } else {
      this.noPasswordForm.markAllAsTouched();
    }

    const newPwd = this.newPasswordControl().value || '';
    const confirmPwd = this.confirmPasswordControl().value || '';

    if (this.hasAnyPassword()) {
      const currentPwd = this.currentPasswordControl().value || '';
      if (!currentPwd || !newPwd || !confirmPwd) {
        this.isPasswordEmpty.set(true);
        return;
      }
    } else {
      if (!newPwd || !confirmPwd) {
        this.isPasswordEmpty.set(true);
        return;
      }
    }

    if (this.hasInvalidChars()) return;
    if (newPwd.length < 8 || confirmPwd.length < 8) return;
    if (newPwd.length > 15 || confirmPwd.length > 15) return;
    if (!this.isPasswordMatch()) return;

    this.isPasswordEmpty.set(false);
    this.isOldPasswordMatch.set(false);

    if (this.hasAnyPassword()) {
      this.sharedService.isLoading.set(true);
      this.changePasswordWithCurrentPassword();
    } else {
      this.storePasswordsLocally(newPwd, confirmPwd);
      this.sendOtpForVerification();
    }
  }

  private changePasswordWithCurrentPassword(): void {
    const request = this.buildPasswordChangeRequest();
    const authToken = this.cookieService.getCookie('authToken');
    
    if (!authToken) {
      this.sharedService.isLoading.set(false);
      this.apiError.set('Authentication token not found');
      return;
    }

    this.makeAuthenticatedRequest(
      (token) => this.changepasswordService.changePassword(request, new HttpHeaders({ Authorization: `Bearer ${token}` }))
    ).subscribe({
      next: (response) => {
        this.sharedService.isLoading.set(false);
        if (response[0]?.eventType === 1) {
          this.showChangePasswordSuccessModal();
        } else {
          this.apiError.set(response[0]?.eventData?.[0]?.value || 'Password update failed');
        }
      },
      error: (error) => {
        this.sharedService.isLoading.set(false);
        this.apiError.set('Failed to change password. Please try again.');
      }
    });
  }

private makeAuthenticatedRequest(requestFn: (token: string) => Observable<any>): Observable<any> {
    const currentToken = this.cookieService.getCookie(productionEnvironment.authTokenCookieName);
    const refreshToken = this.cookieService.getCookie(productionEnvironment.refreshTokenCookieName);

    if (!currentToken) {
        return throwError(() => new Error('No authentication token found. Please login.'));
    }
    
    return requestFn(currentToken).pipe(
        catchError(error => {
            if (error.status === 401 && refreshToken) {
                return this.refreshAuthToken(refreshToken).pipe(
                    switchMap(response => {
                        const newToken = response.event.eventData[0].value.token;
                        this.cookieService.setCookie(productionEnvironment.authTokenCookieName, newToken, 1);
                        return requestFn(newToken);
                    }),
                    catchError(refreshError => {
                        console.error('Token refresh failed:', refreshError);
                        return throwError(() => new Error('Session expired. Please login again.'));
                    })
                );
            }
            return throwError(() => error);
        })
    );
  }

  private buildPasswordChangeRequest() {
    const currentUser = this.currentUser();
    return {
      userGuidId: currentUser.guid,
      userName: currentUser.username,
      oldPassword: this.hasAnyPassword()
        ? this.currentPasswordControl().value
        : '',
      newPassword: this.newPasswordControl().value,
      confirmPassword: this.confirmPasswordControl().value,
      isSocialMedia: false,
    };
  }

  private storePasswordsLocally(newPassword: string, confirmPassword: string): void {
    localStorage.setItem('tempNewPassword', newPassword);
    localStorage.setItem('tempConfirmPassword', confirmPassword);
  }

  private sendOtpForVerification(): void {
    this.sharedService.isLoading.set(true);
    const currentUser = this.currentUser();
    if (!currentUser) {
      this.sharedService.isLoading.set(false);
      this.apiError.set('User information not available');
      return;
    }

    const payload = {
      userGuid: currentUser.guid,
      userName: currentUser.username,
      isForChangePassword: true,
    };

    this.makeAuthenticatedRequest(
      (token) => this.changepasswordService.sendOtpForUpdateUserName(
        payload, 
        new HttpHeaders({ Authorization: `Bearer ${token}` })
      )
    ).subscribe({
      next: (response) => {
        this.sharedService.isLoading.set(false);
        if (Array.isArray(response) && response[0]?.eventType === 1) {
          this.showPasswordForm.set(false);
          this.showOtpVerification.set(true);
          this.startOtpTimer();
        } else {
          this.apiError.set('Failed to send OTP. Please try again.');
        }
      },
      error: (error) => {
        this.sharedService.isLoading.set(false);
        this.apiError.set('Failed to send OTP. Please try again.');
      }
    });
  }

  onVerify(): void {
    if (!this.isCodeComplete()) {
      this.hasError.set(true);
      this.errorMessage.set('Please enter the complete verification code');
      return;
    }

    this.isLoading.set(true);
    const otp = this.codeValues().join('');
    const currentUser = this.currentUser();

    if (!currentUser) {
      this.isLoading.set(false);
      this.hasError.set(true);
      this.errorMessage.set('User information not available');
      return;
    }

    const newPassword = localStorage.getItem('tempNewPassword') || '';
    const confirmPassword = localStorage.getItem('tempConfirmPassword') || '';

    if (!newPassword || !confirmPassword) {
      this.isLoading.set(false);
      this.hasError.set(true);
      this.errorMessage.set(
        'Password information not found. Please start the process again.'
      );
      return;
    }

    const request: ChangePasswordRequest = {
      userGuidId: currentUser.guid,
      userName: currentUser.username,
      oldPassword: '',
      newPassword: newPassword,
      confirmPassword: confirmPassword,
      isSocialMedia: false,
      otp: otp,
    };

    this.makeAuthenticatedRequest(
      (token) => this.changepasswordService.changePassword(
        request, 
        new HttpHeaders({ Authorization: `Bearer ${token}` })
      )
    ).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response[0]?.eventType === 1) {
          localStorage.removeItem('tempNewPassword');
          localStorage.removeItem('tempConfirmPassword');
          this.showChangePasswordSuccessModal();
        } else {
          this.hasError.set(true);
          this.errorMessage.set(
            response[0]?.eventData?.[0]?.value || 'Password update failed'
          );
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.hasError.set(true);
        this.errorMessage.set(
          error.message || 'An error occurred while updating password'
        );
      },
    });
  }

  updateCodeValue(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.codeValues.update((values) => {
      const newValues = [...values];
      newValues[index] = value;
      return newValues;
    });
    if (value && index < 5) {
      const nextInput = document.querySelector(
        `input[type="text"]:nth-child(${index + 2})`
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
    this.hasError.set(false);
    this.errorMessage.set('');
  }

  get firstThreeDigits(): string[] {
    return this.codeValues().slice(0, 3);
  }

  get lastThreeDigits(): string[] {
    return this.codeValues().slice(3);
  }

  getOtpInputIndex(isFirstHalf: boolean, index: number): number {
    return isFirstHalf ? index : index + 3;
  }

  isCodeComplete(): boolean {
    return this.codeValues().every((value) => value && value.trim().length > 0);
  }

  private startOtpTimer(): void {
    this.timeLeft.set(30);
    const timer = setInterval(() => {
      this.timeLeft.update((value) => {
        if (value <= 1) {
          clearInterval(timer);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
  }

  onResendCode(): void {
    this.timeLeft.set(30);
    this.hasError.set(false);
    this.errorMessage.set('');

    const currentUser = this.currentUser();
    if (!currentUser) {
      this.hasError.set(true);
      this.errorMessage.set('User information not available');
      return;
    }

    const payload = {
      userGuid: currentUser.guid,
      userName: currentUser.username,
      isForChangePassword: true,
    };

    this.sharedService.isLoading.set(true);
    this.makeAuthenticatedRequest(
      (token) => this.changepasswordService.sendOtpForUpdateUserName(
        payload, 
        new HttpHeaders({ Authorization: `Bearer ${token}` })
      )
    ).subscribe({
      next: (response) => {
        this.sharedService.isLoading.set(false);
        if (Array.isArray(response) && response[0]?.eventType === 1) {
          this.startOtpTimer();
        } else {
          this.hasError.set(true);
          this.errorMessage.set('Failed to resend OTP. Please try again.');
        }
      },
      error: (error) => {
        this.sharedService.isLoading.set(false);
        this.hasError.set(true);
        this.errorMessage.set('Failed to resend OTP. Please try again.');
      }
    });
  }

  public showChangePasswordSuccessModal() {
    this.modalService.setModalConfigs({
      componentRef: ChangePasswordSuccessModalComponent,
      attributes: {
        modalWidth: '580px',
      },
    });
  }

  ngOnDestroy(): void {
    this.sharedService.isLoading.set(false);
    this.stopTokenRefreshTimer();
  }
}
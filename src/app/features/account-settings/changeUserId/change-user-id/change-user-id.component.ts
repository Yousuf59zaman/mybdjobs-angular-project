import { CommonModule, NgClass } from '@angular/common';
import { Component, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, FormsModule } from '@angular/forms';
import { InputComponent, InputType } from '../../../../shared/components/input/input.component';
import { interval, Subscription } from 'rxjs';
import { ChangeUserIdService } from '../service/change-user-id.service';
import { ApiEventResponse, ChangeUserIdQuery, CheckUserInfoResponse, CheckUserNameExist, CheckUserNameExistResponse, EventDataItem, SendOtpCodeInEmail, SendOtpData, UpdateUserName, UpdateUserResponse, UserInfoPayload } from '../model/change-user-id';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { CookieService } from '../../../../core/services/cookie/cookie.service';

@Component({
  selector: 'app-change-user-id',
  imports: [CommonModule, NgClass, ReactiveFormsModule, TranslocoModule, FormsModule, InputComponent],
  providers: [provideTranslocoScope('accountChangeUserId')],
  templateUrl: './change-user-id.component.html',
  styleUrl: './change-user-id.component.scss'
})
export class ChangeUserIdComponent implements OnInit, OnDestroy {

  isOpen: any;
  isBlueCollar = false;
  maxLength = 50;
  maxValue = 999999999999;
  accountType: string = '';
  type = signal<InputType>('text');
  password = signal<'password' | 'text'>('password');
  showOtpSection = false;

  // OTP related properties
  digits = [0, 1, 2, 3, 4, 5]; // 6 digits for OTP
  code: string[] = ['', '', '', '', '', ''];


  countdown = 600; // 10 minutes in seconds
  resendDisabled = false;
  private countdownSubscription?: Subscription;
  otpError: boolean = false;
  otpSuccess: boolean = false;
  errorMessage: string | null = null;
  codeValidTime = '10 minutes';
  passwordControl = new FormControl('');
  emailForm: FormGroup;
  mobileForm: FormGroup;
  otpControls: FormControl[] = [];
  isVerifying: boolean = false;
  isSuccessModalOpen = false;
  successMessage = '';
  currentUserId = ''; // To store current user ID (email/mobile)
  newUserId = '';
  formattedCountdown: string = this.formatTime(this.countdown);
  cookieValue = '';
  userGuid: string | null = null;

  userName: string = '';
  userNameType: number = 0;
  hasPassword: boolean = false;
  socialMediaId: number = 0;

  constructor(private fb: FormBuilder, private changeUserIdService: ChangeUserIdService,private cookieService: CookieService) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.mobileForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
    });
  }
  emailController = computed(() => this.emailForm.get('email') as FormControl)
  phoneController = computed(()=> this.mobileForm.get('mobile') as FormControl)


  ngOnInit() {
    this.loadCheckUserInfo();
  }

  ngOnDestroy() {
    this.countdownSubscription?.unsubscribe();
  }

  loadCheckUserInfo(): void {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || ''; // for development only
    const userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;

    const query: ChangeUserIdQuery = {
      userGuid: userGuidId ?? ""

    };

    this.changeUserIdService.checkUserInfo(query)
      .subscribe({
        next: (res: CheckUserInfoResponse) => {
          if (res.event.eventType === 1) {
            const dataItem = res.event.eventData.find(d => d.key === 'message');

            if (dataItem) {
              const payloadOrError = dataItem.value;
              if (typeof payloadOrError !== 'string') {
                const userInfo: UserInfoPayload = payloadOrError;
                this.userName = userInfo.userName;
                this.userNameType = userInfo.userNameType;
                this.hasPassword = userInfo.hasPassword;
                this.socialMediaId = userInfo.socialMediaId;
                if (this.isEmailUser) {
                  this.emailForm.reset();
                } else {
                  this.mobileForm.reset();
                }
                return;
              }
            }
            this.errorMessage = 'Unexpected response format.';
          }
          else {
            const errItem = res.event.eventData.find(d => d.key === 'message');
            let msg = 'Failed to load user info.';

            if (errItem && typeof errItem.value === 'string') {
              msg = errItem.value;
            }

            this.errorMessage = msg;
          }
        },
        error: err => {
          console.error('Error loading user info:', err);
          this.errorMessage = 'Failed to load user info. Please try again later.';
        }
      });
  }
  get isEmailUser(): boolean {
    return this.userNameType === 1;
  }
  get showPasswordField(): boolean {
    return this.isEmailUser && this.hasPassword && this.socialMediaId === 0;
  }
  get emailControl(): FormControl {
    return this.emailForm.get('email') as FormControl;
  }
  get mobileControl(): FormControl {
    return this.mobileForm.get('mobile') as FormControl;
  }

  verifyCode() {

    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || ''; // for development only
    const userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;


    const enteredOtp = this.code.join('');
    if (enteredOtp.length !== 6) {
      this.otpError = true;
      this.errorMessage = 'Please enter a 6-digit code';
      return;
    }

    const otpData: SendOtpData = {
      UserGuidId:  userGuidId ?? "",
      UserName: this.currentUserId,
      OTP: enteredOtp

    };

    const updateUserNameData: UpdateUserName = {
      userGuid:  userGuidId ?? "",
      newUserName: this.newUserId,
      userType: this.userNameType
    };

    this.changeUserIdService.verifyOtpCode(otpData).subscribe({
      next: resp => {
        if (resp.event.eventType === 1) {
          this.otpError = false;
          this.otpSuccess = true;
          this.errorMessage = null;
          this.changeUserIdService.updateUserNameInfo(updateUserNameData).subscribe({
            next: (updateResp) => {

              const updateEvent = updateResp[0]?.eventType;

              if (updateEvent) {
                if (updateEvent === 1) {
                  const message = updateResp[0]?.eventData;

                  this.showSuccessModal(message);
                  this.resetAfterSuccess();

                } else {
                  const msg = updateResp[0]?.eventData.find(d => d.key === 'message')?.value
                  this.errorMessage = typeof msg === 'string' ? msg : 'Failed to update user ID.';
                }
              } else {

                this.errorMessage = 'Invalid update response from server';
              }
            },
            error: (err) => {

              this.errorMessage = 'Failed to update user ID. Please try again.';
            }
          });
        }
      }
    });
  }


  private showSuccessModal(eventData: UpdateUserResponse[]) {

    this.isSuccessModalOpen = true;
    const messageItem = eventData.find(d => d.key === 'message');
    this.successMessage = typeof messageItem?.value === 'string'
      ? messageItem.value
      : (this.isEmailUser
        ? 'Email updated successfully!'
        : 'Mobile number updated successfully!');
  }
  private resetAfterSuccess() {
    this.showOtpSection = false;
    this.emailForm.reset();
    this.mobileForm.reset();
    this.code = ['', '', '', '', '', ''];
    this.resendDisabled = false;
    this.countdownSubscription?.unsubscribe();
  }

  closeSuccessModal() {
    this.isSuccessModalOpen = false;
  }
  private startCountdown() {
    this.countdownSubscription?.unsubscribe();
    this.countdown = 600;
    this.resendDisabled = true;

    this.countdownSubscription = interval(1000).subscribe(() => {
      if (this.countdown > 0) {
        this.countdown--;
        this.formattedCountdown = this.formatTime(this.countdown);
      } else {
        this.countdownSubscription?.unsubscribe();
        this.resendDisabled = false;
      }
    });
  }
  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${this.padTime(minutes)}:${this.padTime(remainingSeconds)}`;
  }

  private padTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }

  resendCode() {
    if (this.userNameType === 1) {
      this.onSave();
    }
    else if (this.userNameType === 2) {
      this.onSubmit();
    }
    if (!this.resendDisabled) {
      this.countdown = 600;
      this.resendDisabled = true;
      this.startCountdown();
      this.code = ['', '', '', '', '', ''];
      setTimeout(() => {
        this.resendDisabled = false;
      }, 60000);
    }
  }
  showPassword() {
    const current = this.password()
    this.password.set(current === 'password' ? 'text' : 'password')
  }
  onSave() {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || ''; // for development only
    const userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;

    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    const newEmail = this.emailForm.value.email;
    const userGuid =  userGuidId ?? "";
    const currentEmail = this.userName;

    this.changeUserIdService.checkUserNameExist({
      UserGuid: userGuid,
      NewUserName: newEmail,
      OldPassword: this.emailForm.value.password
    }).subscribe({
      next: (resp) => {
        if (resp.event.eventType === 1) {
          this.sendOtpToNewEmail(userGuid, currentEmail, newEmail);
        } else {
          const msgItem = resp.event.eventData.find(d => d.key.toLowerCase() === 'message');
          this.errorMessage = msgItem?.value || 'This user name already exists. Please try another.';
          this.emailForm.get('email')?.reset();
        }
      },
      error: (err) => {
        console.error('API error:', err);
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
      }
    });
  }
  private sendOtpToNewEmail(userGuid: string, currentEmail: string, newEmail: string) {
    this.newUserId = newEmail;
    this.currentUserId = currentEmail;

    this.changeUserIdService.sendOtp({
      userGuid,
      currentUserName: currentEmail,
      newUserName: newEmail
    }).subscribe({
      next: resp => {
        const event = resp[0];
        if (event.eventType === 1) {
          this.showOtpSection = true;
          this.startCountdown();
        } else {
          const msg = event.eventData.find(d => d.key.toLowerCase() === 'message')?.value;
          this.errorMessage = msg || 'Failed to send OTP.';
        }
      },
      error: () => this.errorMessage = 'Failed to send OTP. Please try again.'
    });
  }
  onEmailInput($event: Event) {
    const input = $event.target as HTMLInputElement;
    const value = input.value;
    this.emailForm.patchValue({ email: value });
  }
  onMobileInput($event: Event) {
    const input = $event.target as HTMLInputElement;
    const value = input.value;
    this.mobileForm.patchValue({ mobile: value });
  }

  onPasswordInput($event: Event) {
    const input = $event.target as HTMLInputElement;
    const value = input.value;
    this.emailForm.patchValue({ password: value });
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (!/^\d*$/.test(value)) {
      this.code[index] = '';
      return;
    }
    this.code[index] = value;
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
    if (!value && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if ([8, 9, 27, 13, 46, 37, 39].indexOf(event.keyCode) !== -1) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }
    if (event.keyCode === 8 && !input.value && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }


  onSubmit(): void {

    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || ''; // for development only
    const userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;


    if (this.mobileForm.invalid) {
      this.mobileForm.markAllAsTouched();
      return;
    }

    const newMobile = this.mobileForm.value.mobile;
    const userGuid =  userGuidId ?? "";
    const currentMobile = this.userName;

    this.changeUserIdService.checkUserNameExist({
      UserGuid: userGuid,
      NewUserName: newMobile,
      OldPassword: null
    }).subscribe({
      next: (resp) => {
        if (resp.event.eventType === 1) {
          this.sendOtpToNewMobile(userGuid, currentMobile, newMobile);
        } else {
          const msgItem = resp.event.eventData.find(d => d.key.toLowerCase() === 'message')?.value;
          this.errorMessage = msgItem || 'This user name already exists. Please try another.';
          this.mobileForm.get('mobile')?.reset();
        }
      },
      error: (err) => {
        console.error('API error:', err);
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
      }
    });

  }

  private sendOtpToNewMobile(userGuid: string, currentMobile: string, newMobile: string) {
    this.newUserId = newMobile;
    this.currentUserId = currentMobile;

    this.changeUserIdService.sendOtp({
      userGuid: userGuid,
      currentUserName: currentMobile,
      newUserName: newMobile
    }).subscribe({
      next: resp => {
        const event = resp[0];
        if (event.eventType === 1) {
          this.showOtpSection = true;
          this.startCountdown();
        } else {
          const msg = event.eventData.find(d => d.key.toLowerCase() === 'message')?.value;
          this.errorMessage = msg || 'Failed to send OTP.';
        }
      },
      error: (err) => {
        console.error('Error sending OTP:', err);
        this.errorMessage = 'Failed to send OTP. Please try again.';
      }
    });
  }

}

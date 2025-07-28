import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { LocalstorageService } from '../../../../core/services/essentials/localstorage.service';
import { LoginService } from '../../services/login.service';
import { SharedService } from '../../services/share.service';
import { interval, map, Observable, startWith, Subject, switchMap, take } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { InputComponent } from "../../../../shared/components/input/input.component";
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';


enum Time {
  InitialTime = 600,
  resendTime = 30,
  min = 60,
  sec = 60
}

@Component({
  selector: 'app-security-code',
  imports: [ReactiveFormsModule, InputComponent, TranslocoModule],
  providers: [provideTranslocoScope('signin')],
  templateUrl: './security-code.component.html',
  styleUrl: './security-code.component.scss'
})
export class SecurityCodeComponent {
  private localStorageService = inject(LocalstorageService);
  private loginService = inject(LoginService);
  protected sharedService = inject(SharedService);

  private destroyRef = inject(DestroyRef);
  private translocoService = inject(TranslocoService);

  currentLang = signal(this.translocoService.getActiveLang());
  langChanges$ = this.translocoService.langChanges$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(lang => {
      this.currentLang.set(lang);
    });
  private readonly restartCountdown$ = new Subject<number>();
  private totalSeconds = Time.InitialTime;
  private readonly countdownTrigger = signal(0);
  readonly userInfo = this.sharedService.userInfo
  readonly selectedUser = this.sharedService.selectedUser
  isOtpControlInvalid = signal(false);
  isExceedLimit = signal(false);


  otpControl = new FormControl<string>('', {
    validators: [Validators.required]
  });



  isEmail = this.localStorageService.getItem('isEmail').toString() ?? 'false'
  isCounting = computed(() => this.timeLeft() > 0);
  constructor() {
    this.restartCountdown$.next(Time.InitialTime);
  }

  private createCountdown$(): Observable<number> {
    return interval(1000).pipe(
      take(this.totalSeconds + 1),
      map(i => this.totalSeconds - i)
    );
  }

  private readonly countdownObservable = computed(() => {
    this.countdownTrigger();
    return this.createCountdown$();
  });

  readonly timeLeft = toSignal(
    this.restartCountdown$.pipe(
      startWith(Time.InitialTime),
      switchMap((duration) => interval(1000).pipe(
        take(duration + 1),
        map(i => duration - i)
      ))
    ),
    { initialValue: Time.InitialTime }
  );


  readonly formattedTime = computed(() => {
    const total = this.timeLeft();
    const mins = Math.floor(total / Time.min);
    const secs = total % Time.sec;
    return `${mins}:${secs.toString().padStart(2, '0')}`
  })

  startResendCountdown() {
    this.totalSeconds = Time.resendTime;
    this.restartCountdown$.next(this.totalSeconds);
    this.postSendOtp()
  }

  maskNumber(phoneNumber: string): string {
    const str = phoneNumber.toString();
    return `+${str.slice(0, 3)} ${str[3]}${str.slice(4, -1).replace(/\d/g, '*')}${str.slice(-1)}`;
  }

  getForgetPasswordVerifyOtp() {
    this.sharedService.isLoading.set(true);
    const username = this.userInfo()?.username ?? ''
    const userGuid = this.userInfo()?.guidId ?? ''
    this.loginService.getForgetPasswordVerifyOtp(userGuid, username, this.otpControl.value as string)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.sharedService.isLoading.set(false);
          const responseType = response.event.eventType === 1 ? true : false
          if (responseType) {
            this.isOtpControlInvalid.set(false);
            this.sharedService.updateType('reset_pass');

          }
          else {
            if (response.event.eventData[0].value === 'OTP codes are Invalid') {
              this.isOtpControlInvalid.set(true);
            }
            else {
              this.isExceedLimit.set(true);
            }

          }

        },
        error: (error) => {
          this.sharedService.isLoading.set(false);
          this.isOtpControlInvalid.set(true);
        }

      })
  }

  postSendOtp() {
    this.sharedService.isLoading.set(true)
    const sendOtpReq = {
      userGuid: this.selectedUser().userGuid ?? '',
      recoveryType: 2,
      dateOfBirth: '',
      requestType: this.selectedUser().requestType,
      userName: this.selectedUser().username
    }
    this.sharedService.isLoading.set(true);
    this.loginService.postSendOtp(sendOtpReq)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          if (response[0].eventType === 1) {
            this.sharedService.isLoading.set(false);
            this.isOtpControlInvalid.set(false);
            const isEmail = typeof response[0]?.eventData?.[0]?.value === 'boolean'
              ? response[0].eventData[0].value
              : false;

            this.localStorageService.setItem('isEmail', String(isEmail));
            this.sharedService.updateType('sec_code');
          }


        },
        error: error => {

        }

      })



  }


  onSubmit(event: Event) {
    event.preventDefault();
    if (this.otpControl.valid) {
      this.getForgetPasswordVerifyOtp();

    }
    else {
      this.isOtpControlInvalid.set(true);
    }
  }
}

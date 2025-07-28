import { Component, computed, DestroyRef, inject, isDevMode, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { OtpVerifyService } from '../service/otp-verify.service';
import { OtpApiResponse, OtpData, serviceData } from '../model/otpverify';
import { CreateAccountService } from '../../create-account/services/create-account.service';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CircularLoaderService } from '../../../../core/services/circularLoader/circular-loader.service';
import { filter, finalize } from 'rxjs';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, InputComponent, TranslocoModule, ReactiveFormsModule],
  providers: [provideTranslocoScope('otp')],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss'
})
export class OtpVerificationComponent implements OnInit {
  userId: string = '';
  guidID: string = '';
  userNumber: string = '';
  userEmail: string = '';
  userNameType: string = '';
  accountType: string = '';
  errorMsg: string = '';
  serviceGUID: string ='';
  validationText = signal('');

  private fb = inject(FormBuilder);
  private otpService = inject(OtpVerifyService);
  private createAccountService = inject(CreateAccountService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private loadr = inject(CircularLoaderService);

  otpForm = this.fb.group({
    otpCode: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern(/^\d{6}$/)
    ])
  });

  otpControl = computed(
    () => this.otpForm.get('otpCode') as FormControl<string>
  );

  constructor() { }

  ngOnInit(): void {
    this.getAccountType();
    this.getUserNameType();
    this.getCreatedGuid();
    this.getCreatedTempId();
    this.getCreatedPhone();
    this.getUserEmail();

    this.otpControl()
      .valueChanges.subscribe(
        () => this.getValidationText()
      );

  }

  getCreatedTempId(): void{
    this.userId = this.createAccountService.getCreatedTempId()|| '';

  }

  getAccountType(): void {
    this.accountType = this.createAccountService.getAccountType() || '';
  }

  getUserNameType(): void {
    this.userNameType = this.createAccountService.getUserNameType() || '';
  }

  getCreatedGuid(): void {
    this.guidID = this.createAccountService.getCreatedGuid() || '';
  }

  getCreatedPhone(): void {
    this.userNumber = this.createAccountService.getCreatedPhone() || '';
  }

  getUserEmail(): void {
    this.userEmail = this.createAccountService.getCreatedEmail() || '';
  }

  get OtpControll(): FormControl {
    return this.otpForm.get('otpCode') as FormControl;
  }

  createPayload(otpCode: string): OtpData {
    this.getAccountType();
    this.getUserNameType();
    this.getCreatedGuid();
    this.getCreatedPhone();
    this.getUserEmail();

    // For email verification - use guidId
    if (this.userNameType?.toLowerCase() === 'email') {
      const payload: OtpData = {
        tempUserId: 0,
        userGuidId: this.guidID,  // Use guidId from previous page
        otpCode: parseInt(otpCode || '0'),
        isFromTTC: false,
        sendOtpToMobileOrEmail: this.userNameType,
        createdFrom: 0
      };
      return payload;
    }
    if (this.userNameType?.toLowerCase() === 'mobile') {
      // For mobile verification - use tempUserId
      const payload: OtpData = {
        tempUserId: parseInt(this.userId || '0'),  // Use tempId from previous page
        userGuidId: '',  // Empty string for mobile verification
        otpCode: parseInt(otpCode || '0'),
        isFromTTC: false,
        sendOtpToMobileOrEmail: this.userNameType,
        createdFrom: 0
      };
      return payload;
    }

    // Default return for any other case
    return {
      tempUserId: 0,
      userGuidId: '',
      otpCode: parseInt(otpCode || '0'),
      isFromTTC: false,
      sendOtpToMobileOrEmail: this.userNameType || '',
      createdFrom: 0
    };
  }

  onSubmit(): void {
    this.otpForm.markAllAsTouched();

    if (this.otpForm.valid && this.otpForm.value.otpCode?.length === 6) {
      const payload = this.createPayload(this.otpForm.value.otpCode);
      this.loadr.setLoading(true);
      this.otpService.submitOtpCode(payload)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          filter((res) => res.eventType === 1),
          finalize(() => this.loadr.setLoading(false)),
        )
        .subscribe({
          next: (res: OtpApiResponse) => {
            // Get guidId from response
            const guidId = res.eventData.find(d => d.key === 'Guid')?.value;
            if (guidId) {
              this.createAccountService.setCreatedGuid(guidId);
            }

            if (this.userNameType?.toLowerCase() === 'email')
            {
              this.serviceGUID = this.guidID
            } else if(this.userNameType?.toLowerCase()=='mobile'){
              this.serviceGUID = this.createAccountService.getCreatedGuid() || '';
            }

            const servicePayload: serviceData = {
              userid: "",
              companyId: "",
              systemId: 1,
              jobseekerGuid: this.serviceGUID,
              decodeId: "",
              isFromMis: true
            };

            this.otpService.executeService(servicePayload).subscribe({
              next: (response) => {
                this.router.navigate(['create-account/address-info']);
              },
            });

          },
          error: err => {
            this.validationText.set((this.accountType === 'd' || this.accountType === 'b') ? 'সঠিক OTP কোডটি টাইপ করুন।' : 'Please provide valid OTP code.');
            this.errorMsg = err.error?.message || 'Failed to verify OTP';
          }
        });
    } else {
      this.validationText.set((this.accountType === 'd' || this.accountType === 'b') ? 'OTP কোডটি টাইপ করুন।' : 'Please provide valid OTP code.');

    }
  }

  getValidationText() {
    if(this.otpControl().dirty) {
      if (this.otpForm.controls.otpCode.errors?.['required']) {
        this.validationText.set(this.accountType === 'd' ? 'ওটিপি কোডটি টাইপ করুন।' : 'Please provide the OTP code.');
      } else if (this.OtpControll.value.length<6) {
        this.validationText.set(this.accountType === 'd' ? 'সঠিক ৬ সংখ্যার কোড দিন।' : 'OTP must be exactly 6 digits.');
      } else if (this.OtpControll.value.length>6) {
        this.validationText.set(this.accountType === 'd' ? 'OTP ৬ সংখ্যার বেশি হতে পারবে না।' : 'OTP cannot be more than 6 digits.');
      } else if (this.otpForm.controls.otpCode.errors?.['pattern']) {
        this.validationText.set(this.accountType === 'd' ? 'OTP-তে শুধুমাত্র সংখ্যা থাকতে হবে।' : 'OTP must contain only numbers.');
      } else {
        this.validationText.set('');
      }
    }
  }

  resendOtp(): void {
    this.loadr.setLoading(true);
    if (this.otpForm.valid && this.otpForm.value.otpCode?.length === 6) {
      const payload = this.createPayload(this.otpForm.value.otpCode);

      this.otpService.submitOtpCode(payload).subscribe({
        next: (res: OtpApiResponse) => {
          this.loadr.setLoading(false);

          if (res.eventType === 1) {

            alert("A new OTP has been sent to your number.");
          } else {

            alert("Failed to resend OTP. Please try again.");
          }
        },
        error: err => {
          console.error('HTTP error resending OTP:', err);
        }
      });
    }
  }
}

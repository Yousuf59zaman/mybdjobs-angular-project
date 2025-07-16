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

    // Debug logging
    console.log('Initial Values:', {
      accountType: this.accountType,
      userNameType: this.userNameType,
      userNumber: this.userNumber,
      userEmail: this.userEmail,
      userId: this.userId,
      guidID: this.guidID
    });
  }

  getCreatedTempId(): void{
    this.userId = this.createAccountService.getCreatedTempId()|| '';
    console.log('userId:', this.userId);

  }

  getAccountType(): void {
    this.accountType = this.createAccountService.getAccountType() || '';
    console.log('Account Type from service:', this.accountType);
  }

  getUserNameType(): void {
    this.userNameType = this.createAccountService.getUserNameType() || '';
    console.log('Username Type from service:', this.userNameType);
  }

  getCreatedGuid(): void {
    this.guidID = this.createAccountService.getCreatedGuid() || '';
    console.log('GUID:', this.guidID);
  }

  getCreatedPhone(): void {
    this.userNumber = this.createAccountService.getCreatedPhone() || '';
    console.log('User Phone from service:', this.userNumber);
    console.log('Service state:', {
      userNameType: this.userNameType,
      accountType: this.accountType,
      tempId: this.userId,
      guidId: this.guidID
    });
  }

  getUserEmail(): void {
    this.userEmail = this.createAccountService.getCreatedEmail() || '';
    console.log('User Email:', this.userEmail);
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

    console.log('Creating payload with:', {
      accountType: this.accountType,
      userNameType: this.userNameType,
      guidId: this.guidID,
      tempUserId: this.userId,
      userNumber: this.userNumber,
      userEmail: this.userEmail
    });

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
      console.log('Email verification payload:', payload);
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
      console.log('Mobile verification payload:', payload);
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
      console.log('Form is valid, submitting OTP...');
      const payload = this.createPayload(this.otpForm.value.otpCode);
      console.log('Submitting payload:', payload);
      this.loadr.setLoading(true);
      this.otpService.submitOtpCode(payload)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          filter((res) => res.eventType === 1),
          finalize(() => this.loadr.setLoading(false)),
        )
        .subscribe({
          next: (res: OtpApiResponse) => {
            console.log('API Response:', res);
            console.log('Success, message is:', res.eventData.find(d => d.key === 'message')?.value);
            // Get guidId from response
            const guidId = res.eventData.find(d => d.key === 'Guid')?.value;
            if (guidId) {
              this.createAccountService.setCreatedGuid(guidId);
              console.log('Set new guidId:', guidId);
            }

            if (this.userNameType?.toLowerCase() === 'email')
            {
              this.serviceGUID = this.guidID
              console.log('service api previous guid:',this.serviceGUID)
            } else if(this.userNameType?.toLowerCase()=='mobile'){
              this.serviceGUID = this.createAccountService.getCreatedGuid() || '';
              console.log('service api new guid:',this.serviceGUID)
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
                console.log('Service API Response:', response);
              },
              error: (error) => {
                console.error('Service API Error:', error);
              }
            });
            this.router.navigate(['create-account/address-info']);
            // console.error('Server returned error eventType:', res.eventType);
            // console.error('Error details:', res.eventData);
          },
          error: err => {
            this.validationText.set((this.accountType === 'd' || this.accountType === 'b') ? 'সঠিক OTP কোডটি টাইপ করুন।' : 'Please provide valid OTP code.');
            console.error('HTTP error verifying OTP:', err);
            console.error('Error status:', err.status);
            console.error('Error message:', err.message);
            console.error('Error response:', err.error);
            this.errorMsg = err.error?.message || 'Failed to verify OTP';
          }
        });
    } else {
      this.validationText.set((this.accountType === 'd' || this.accountType === 'b') ? 'OTP কোডটি টাইপ করুন।' : 'Please provide valid OTP code.');
      console.log("Form is invalid or OTP is not 6 digits, submission blocked!");
      console.log('Form Status:', {
        valid: this.otpForm.valid,
        otpLength: this.otpForm.value.otpCode?.length,
        errors: this.otpForm.errors
      });
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
          console.log("API Response:", res);
          if (res.eventType === 1) {
            console.log("OTP Resent Successfully");
            alert("A new OTP has been sent to your number.");
          } else {
            console.log("Error in OTP resend");
            alert("Failed to resend OTP. Please try again.");
          }
        },
        error: err => {
          console.error('HTTP error resending OTP:', err);
        }
      });
    } else {
      console.log("Invalid OTP code or form not valid for resending OTP.");
    }
  }
}

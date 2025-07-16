import { Component, DestroyRef, inject, signal } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { LoginService } from '../services/login.service';
import { SharedService } from '../services/share.service';
import { redirectExternal } from '../../../shared/utils/functions';
import { mybdjobsWelcome } from '../../../shared/enums/app.enums';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  imports: [InputComponent, ReactiveFormsModule, NgClass, TranslocoModule, CommonModule],
  providers: [provideTranslocoScope('signin')],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss'
})
export class PasswordComponent {
  private loginService = inject(LoginService)
  protected sharedService = inject(SharedService)
  private destroyRef = inject(DestroyRef);
  private translocoService = inject(TranslocoService);
  private router = inject(Router);

  currentLang = signal(this.translocoService.getActiveLang());
  langChanges$ = this.translocoService.langChanges$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(lang => {
      this.currentLang.set(lang);
    });

  type = signal<'text' | 'password'>('password')
  maxValue = 9999999999999999
  maxLength = 15
  validationText: string = ''
  isWrongPass = signal<boolean>(false)
  isLoading = signal(false)
  isPasswordEmpty = signal(false)
  userObj = this.sharedService.userInfo


  passwordControl = new FormControl<string | null>('', [Validators.required])



  getPhoto(photoUrl: string): string {
    if (photoUrl) {
      if (photoUrl === 'https://storage.googleapis.com/bdjobs/mybdjobs/photos') {
        return 'images/avatar.svg'
      } else {
        return photoUrl
      }
    }
    else {
      return 'images/avatar.svg'
    }

  }

  showPassword() {
    const current = this.type()
    this.type.set(current === 'password' ? 'text' : 'password')

  }

  backPage() {
    this.sharedService.updateType('username')
  }


  onSubmit(event: Event) {
    event.preventDefault();

    this.isWrongPass.set(false);
    this.isPasswordEmpty.set(false);
    this.passwordControl.markAsDirty();
    this.passwordControl.markAllAsTouched();

    const password = this.passwordControl.value?.trim();

    if (!password) {
      this.isPasswordEmpty.set(true);
      return;
    }

    if (this.passwordControl.invalid) {
      this.isPasswordEmpty.set(true);
      return;
    }

    // this.sharedService.isLoading.set(true);
    this.isLoading.set(true)

    const user = this.userObj();

    const userPasswordBody = {
      userName: user?.username ?? '',
      password: this.passwordControl.value,
      systemId: 1,
      userid: "",
      otp: "",
      isForOTP: false,
      socialMediaName: '',
      guidId: user?.guidId ?? '',
      socialMediaId: '',
      socialMediaAutoIncrementId: 0,
      purpose: user?.purpose,
      referPage: '',
      version: ''
    };

    this.loginService.postUserPassword(userPasswordBody)
      .pipe(take(1))
      .subscribe({
        next: (value) => {


          if (value.event.eventType === 1) {
            // redirectExternal(mybdjobsWelcome);
            // this.router.navigate(['/edit-profile']);
            alert('Login successful!')
            this.isWrongPass.set(false);

          } else {
            this.isWrongPass.set(true);
          }
          // this.sharedService.isLoading.set(false);
          this.isLoading.set(false)

        },
        error: (error) => {
          this.sharedService.isLoading.set(false);
          console.error("Error occurred:", error);
          this.isWrongPass.set(true);
        }
      });


  }
}

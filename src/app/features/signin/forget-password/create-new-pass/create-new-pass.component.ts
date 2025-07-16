import { ChangeDetectorRef, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { editPasswordRequest } from '../../models/login.model';
import { LoginService } from '../../services/login.service';
import { SharedService } from '../../services/share.service';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { NgClass, TitleCasePipe } from '@angular/common';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-new-pass',
  imports: [InputComponent, ReactiveFormsModule, NgClass, TitleCasePipe, TranslocoModule],
  providers: [provideTranslocoScope('signin')],
  templateUrl: './create-new-pass.component.html',
  styleUrl: './create-new-pass.component.scss'
})
export class CreateNewPassComponent {
  private loginService = inject(LoginService)
  protected sharedService = inject(SharedService)
  private destroyRef = inject(DestroyRef);
  private translocoService = inject(TranslocoService);
  private cdr = inject(ChangeDetectorRef);

  currentLang = signal(this.translocoService.getActiveLang());
  langChanges$ = this.translocoService.langChanges$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(lang => {
      this.currentLang.set(lang);
    });

  userObj = this.sharedService.userInfo;
  isPasswordEmpty = signal(false);
  // isPasswordMatch = signal(false);
  isOldPasswordMatch = signal(false);
  type = signal<'text' | 'password'>('password');
  typeNewPass = signal<'text' | 'password'>('password');
  newPasswordValidationText = ''
  readonly apiError = signal('');
  submitted = signal(false);

  ngOnInit(): void {

    this.passwordControl().valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      if (this.submitted()) {
        this.submitted.set(false);
      }
    });

    this.NewPasswordControl().valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      if (this.submitted()) {
        this.submitted.set(false);
      }
    });
  }



  createPasswordForm = new FormGroup({
    password: new FormControl<string | null>('', [Validators.required,]),
    newPassword: new FormControl<string | null>('', [Validators.required])
  })



  passwordControl = computed(() => {
    return this.createPasswordForm.get('password') as FormControl
  })

  NewPasswordControl = computed(() => {
    return this.createPasswordForm.get('newPassword') as any as FormControl
  })




  passwordValidation(value: string = ''): string {
    if (value.length >= 8 && value.length < 16) {
      const hasCapital = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSmaller = /[a-z]/.test(value);
      const hasSpecial = /[^A-Za-z0-9]/.test(value);
      const passedChecks = [hasCapital, hasNumber, hasSmaller, hasSpecial].filter(Boolean).length;
      if (passedChecks === 4) {
        return this.currentLang() === 'en' ? 'strong' : 'শক্তিশালী';
      } else if (passedChecks === 3) {
        return this.currentLang() === 'en' ? 'average' : 'মধ্যম';
      } else {
        return this.currentLang() === 'en' ? 'weak' : 'দুর্বল';;
      }
    }
    return '';
  }

  getPasswordStrengthBars(value: string = ''): string[] {
    const level = this.passwordValidation(value);

    switch (level) {
      case 'weak':
        return ['bg-[#E42D27]', 'bg-[#E42D27]', 'bg-[#D9D9D9]', 'bg-[#D9D9D9]', 'bg-[#D9D9D9]'];
      case 'average':
        return ['bg-[#FF9F40]', 'bg-[#FF9F40]', 'bg-[#FF9F40]', 'bg-[#FF9F40]', 'bg-[#D9D9D9]'];
      case 'strong':
        return ['bg-[#32A071]', 'bg-[#32A071]', 'bg-[#32A071]', 'bg-[#32A071]', 'bg-[#32A071]'];
      case 'শক্তিশালী':
        return ['bg-[#32A071]', 'bg-[#32A071]', 'bg-[#32A071]', 'bg-[#32A071]', 'bg-[#32A071]'];
      case 'মধ্যম':
        return ['bg-[#FF9F40]', 'bg-[#FF9F40]', 'bg-[#FF9F40]', 'bg-[#FF9F40]', 'bg-[#D9D9D9]'];
      case 'দুর্বল':
        return ['bg-[#E42D27]', 'bg-[#E42D27]', 'bg-[#D9D9D9]', 'bg-[#D9D9D9]', 'bg-[#D9D9D9]'];
      default:
        return ['bg-[#D9D9D9]', 'bg-[#D9D9D9]', 'bg-[#D9D9D9]', 'bg-[#D9D9D9]', 'bg-[#D9D9D9]'];
    }
  }

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
  readonly isPasswordMatch = computed(() => {
    const pwd = this.passwordControl().value ?? '';
    const newPwd = this.NewPasswordControl().value ?? '';
    return pwd === newPwd && pwd.length >= 8 && pwd.length <= 15;
  });


  hasInvalidChars(): boolean {
    const value = this.passwordControl()?.value;
    return !!value && /[\\%&()<>\s]/.test(value);
  }

  updateNewPassword() {
    this.isOldPasswordMatch.set(false);
    this.sharedService.isLoading.set(true);
    const userInformation: editPasswordRequest = {
      userGuidId: this.userObj()?.guidId ?? '',
      username: this.userObj()?.username ?? '',
      newPassword: this.passwordControl().value,
      confirmPassword: this.NewPasswordControl().value
    }
    this.loginService.updateNewPassword(userInformation)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.sharedService.isLoading.set(false);

          if (response[0].eventType === 2) {
            let message = response[0]?.eventData?.[0]?.value;
            if (message === "Confirm Password must match the New Password.") {
              message = "These passwords do not match"
            }
            console.log("message", message)

            this.isOldPasswordMatch.set(true);
            this.apiError.set(message);

          } else {
            this.sharedService.updateType('success');
          }

          console.log(response)
        },
        error: (error) => {
          this.sharedService.isLoading.set(false);
          console.log("error", error)
        }
      })
  }



  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted.set(true);

    const pwd = this.passwordControl().value || '';
    const newPwd = this.NewPasswordControl().value || '';

    if (!pwd || !newPwd) {
      this.isPasswordEmpty.set(true);
      return;
    }
    if (this.hasInvalidChars()) {
      return;
    }

    if (pwd.length < 8 || newPwd.length < 8) {
      this.isPasswordEmpty.set(false);
      return;
    }

    if (pwd.length > 15 || newPwd.length > 15) {
      this.isPasswordEmpty.set(false);
      return;
    }


    this.isPasswordEmpty.set(false);
    this.updateNewPassword();
  }

}

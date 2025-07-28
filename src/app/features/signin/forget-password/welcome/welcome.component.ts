import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedService } from '../../services/share.service';
import { LoginService } from '../../services/login.service';
import { LocalstorageService } from '../../../../core/services/essentials/localstorage.service';
import { take } from 'rxjs';
import { NgClass } from '@angular/common';
import { provideTranslocoScope, TranslocoModule, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-welcome',
  imports: [ReactiveFormsModule,NgClass, TranslocoModule,],
  providers: [provideTranslocoScope('signin')],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  protected sharedService = inject(SharedService)
  private loginService = inject(LoginService)
  private localStorageService = inject(LocalstorageService)

  private destroyRef = inject(DestroyRef);
  private translocoService = inject(TranslocoService);

  currentLang = signal(this.translocoService.getActiveLang());
  langChanges$ = this.translocoService.langChanges$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(lang => {
        this.currentLang.set(lang);
  });

  isSendOtpFailed = signal(false);
  userInfo = this.sharedService.selectedUser

  ngOnInit(): void {
      this.resetType.valueChanges.subscribe((value: string | null) =>{
        this.updateUserInfo(value);
      })
  }

  updateUserInfo = (resetType:string | null) =>{
    this.userInfo.update(current =>({
      ...current,
      requestType:resetType
    }))
  }

  resetType = new FormControl<string | null>('',{
    validators: [Validators.required]
  })

  onSubmit(event:Event) {
    event.preventDefault();

    this.sharedService.updateUserInfo(
      this.userInfo().username,
      this.userInfo().fullName,
      this.userInfo().userGuid,
      this.userInfo().profilePicture,
      this.userInfo().email,
      this.userInfo().phone
    )
    if(this.resetType.valid){

      if(this.resetType.value === 'password'){


        this.sharedService.isLoaderTrue()
        this.sharedService.updateType('password');
      }else{
        this.sharedService.isLoading.set(true)
        const sendOtpReq = {
          userGuid:this.userInfo().userGuid,
          recoveryType:2,
          dateOfBirth:'',
          requestType:this.userInfo().requestType,
          userName:this.userInfo().username
        }
        this.loginService.postSendOtp(sendOtpReq)
        .pipe(take(1))
        .subscribe({
          next:(response) =>{
            this.sharedService.isLoading.set(false);
            if (response[0].eventType === 1) {

              const isEmail = typeof response[0]?.eventData?.[0]?.value === 'boolean'
                ? response[0].eventData[0].value
                : false;

              this.localStorageService.setItem('isEmail', String(isEmail));
              this.sharedService.updateType('sec_code');
            }
            else{
              this.isSendOtpFailed.set(true)
            }
          }
        })
      }


    }

  }
}

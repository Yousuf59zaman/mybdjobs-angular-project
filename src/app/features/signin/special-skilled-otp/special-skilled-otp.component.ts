import { Component, DestroyRef, inject, signal } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { LoginService } from '../services/login.service';
import { SharedService } from '../services/share.service';
import { FormControl, Validators } from '@angular/forms';
import { mybdjobsWelcome } from '../../../shared/enums/app.enums';
import { redirectExternal } from '../../../shared/utils/functions';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';


@Component({
  selector: 'app-special-skilled-otp',
  imports: [InputComponent, TranslocoModule],
  providers: [provideTranslocoScope('signin')],
  templateUrl: './special-skilled-otp.component.html',
  styleUrl: './special-skilled-otp.component.scss'
})
export class SpecialSkilledOtpComponent {
  private loginService = inject(LoginService)
  protected sharedService = inject(SharedService)
  private destroyRef = inject(DestroyRef);
  private translocoService = inject(TranslocoService);
  currentLang = signal(this.translocoService.getActiveLang());
  langChanges$ = this.translocoService.langChanges$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(lang => { 
      this.currentLang.set(lang);
  });
  userObj = this.sharedService.userInfo
  maxLength = 6
  isWrongOtp = signal<boolean>(false)
  isOtpEmpty = signal(false);

  otpControl = new FormControl<string>('',[Validators.required])
  

  getPhoto(photoUrl:string):string{
    if(photoUrl){
      if(photoUrl === 'https://storage.googleapis.com/bdjobs/mybdjobs/photos'){
        return 'images/avatar.svg'
      }else{
        return photoUrl
      }
    }
    else{
      return 'images/avatar.svg'
    }
    
  }

  backPage(){
    this.sharedService.updateType('username')
  }

  onSubmit(event: Event) {
        event.preventDefault();
        
      this.isOtpEmpty.set(false);
      this.isWrongOtp.set(false)
      this.otpControl.markAsDirty()
      this.otpControl.markAllAsTouched()
      const otp = this.otpControl.value?.trim();
  
    if (!otp) {
      this.isOtpEmpty.set(true);
      return;
    }
      if(this.otpControl.invalid){
        this.isOtpEmpty.set(true);
        return;
      }else{
        this.sharedService.isLoading.set(true);
        const userOtpBody = {
          userName:this.userObj()?.username ?? null,
          password:'',
          systemId:1,
          userid:"",
          otp:this.otpControl.value?.toString() ?? '',
          isForOTP:true,
          socialMediaName:'',
          guidId:this.userObj()?.guidId ,
          socialMediaId:'',
          socialMediaAutoIncrementId:0,
          purpose:this.userObj()?.purpose,
          referPage:'',
          version:''
        }
        this.loginService.postUserPassword(userOtpBody)
        .pipe(take(1))
        .subscribe({
          next:(value) =>{
            this.sharedService.isLoading.set(false);
            if(value.event.eventType === 2){
              this.isWrongOtp.set(true)
            }else{
              redirectExternal(mybdjobsWelcome)
              this.isWrongOtp.set(false)
              
            }
          },
          error:(error) =>{
            console.error(error);
            this.sharedService.isLoading.set(false)
          }
        })
        
      }
        
  }
}

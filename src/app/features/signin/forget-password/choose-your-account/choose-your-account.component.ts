import { Component, DestroyRef, inject, signal } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { SharedService } from '../../services/share.service';
import { getUserListResponse } from '../../models/login.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-choose-your-account',
  imports: [ReactiveFormsModule,NgClass,DatePipe,TranslocoModule],
  providers: [provideTranslocoScope('signin')],
  templateUrl: './choose-your-account.component.html',
  styleUrl: './choose-your-account.component.scss'
})
export class ChooseYourAccountComponent {
  private loginService = inject(LoginService)
  private destroyRef = inject(DestroyRef);
  private translocoService = inject(TranslocoService);   
  protected sharedService = inject(SharedService)
  
  currentLang = signal(this.translocoService.getActiveLang());
     langChanges$ = this.translocoService.langChanges$
       .pipe(takeUntilDestroyed(this.destroyRef))
       .subscribe(lang => { 
        this.currentLang.set(lang);
 });
  selectedUser = signal<getUserListResponse>({} as getUserListResponse)
  userList = signal<getUserListResponse[]>([])

  account = new FormControl<string>('',{
    nonNullable: true,
    validators: [Validators.required]
  })
  ngOnInit(): void {
      this.userList.set(this.sharedService.userList())
      this.account.valueChanges.subscribe((value) =>{
        this.selectUser(value);
      } )
      
  }

  
  private selectUser(username:string | null){
    const user = this.userList().find(
      user => (user.userName || user.socialMediaName) === this.account.value
    );
    if(user){
      this.selectedUser.set(user);
    }
    console.log("selectedUSer:",this.selectedUser())
  }

  
  



  onSubmit(event: Event) {
    event.preventDefault()

    if(this.account.valid){
      this.sharedService.isLoaderTrue()
      console.log("True",this.account.value)
      const user = {
        userGuid:this.selectedUser().userGuid,
        recoveryType:2,
        dateofBirth:'',
        username:this.selectedUser().userName,
        phone:this.selectedUser().phone,
        fullName:this.selectedUser().fullName,
        email:this.selectedUser().email,
        profilePicture:this.selectedUser().profilePicture
      }
      this.sharedService.updateSelectedUser(user);
      if(this.selectedUser().logInStatus ==='0' && !this.selectedUser().socialMediaName){
        this.sharedService.updateUserInfo(
          this.selectedUser().userName,
          this.selectedUser().fullName,
          this.selectedUser().userGuid,
          this.selectedUser().profilePicture,
          this.selectedUser().email,
          this.selectedUser().userName
        )
        this.sharedService.updateType('otp');
      }
      else if(this.selectedUser().socialMediaName === 'G' && !this.selectedUser().userName){
        this.sharedService.updateType('google');
      }else if(this.selectedUser().socialMediaName === 'L' && !this.selectedUser().userName){
        this.sharedService.updateType('linkedin');
      }
      else{
        this.sharedService.updateType('welcome')
      }
      
      
      
    }
  // throw new Error('Method not implemented.');
    
  }
}

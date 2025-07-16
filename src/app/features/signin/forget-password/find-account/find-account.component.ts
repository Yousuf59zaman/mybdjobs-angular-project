import { Component, DestroyRef, inject, signal } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { SharedService } from '../../services/share.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { take } from 'rxjs';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-find-account',
  imports: [ReactiveFormsModule, InputComponent,TranslocoModule],
  providers: [provideTranslocoScope('signin')],
  templateUrl: './find-account.component.html',
  styleUrl: './find-account.component.scss'
})
export class FindAccountComponent {
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

 validationText = signal('');
 isWrongUsername = signal(false);

usernameControl = new FormControl<string>('', [Validators.required]);

ngOnInit(): void {
  
}

  onSubmit(event: Event) {
    this.isWrongUsername.set(false);
    event.preventDefault();
    if(this.usernameControl.valid){
      const username = this.usernameControl.value ?? '';
      this.sharedService.isLoading.set(true);
      this.loginService.getUserList(username)
      .pipe(take(1))
        .subscribe({
          next:(response) =>{
            const value = response.event.eventData[0].value
            if(response.event.eventType === 2){
              this.isWrongUsername.set(true);
             
              
            }
            else{
              this.sharedService.updateType('choose_acc')
              this.sharedService.updateUserList(value)
            }
            this.sharedService.isLoading.set(false);
            
          }
          
        })
    }
    else{
      this.validationText.set("Please provide valid username");
      

    }
    
  }
  goToHome(){
    this.sharedService.updateType('username');
  }
}

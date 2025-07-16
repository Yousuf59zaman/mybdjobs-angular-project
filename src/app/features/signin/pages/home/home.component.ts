import { Component, effect, inject } from '@angular/core';
import { PasswordComponent } from "../../password/password.component";
import { SpecialSkilledOtpComponent } from "../../special-skilled-otp/special-skilled-otp.component";
import { CarouselComponent } from "../../carousel/carousel.component";
import { rightPanel, SharedService } from '../../services/share.service';
import { LoginService } from '../../services/login.service';
import { UserAuthenticationComponent } from "../../user-authentication/user-authentication.component";
import { FindAccountComponent } from "../../forget-password/find-account/find-account.component";
import { AccessAccountComponent } from "../../forget-password/access-account/access-account.component";
import { ChooseYourAccountComponent } from "../../forget-password/choose-your-account/choose-your-account.component";
import { SecurityCodeComponent } from "../../forget-password/security-code/security-code.component";
import { CreateNewPassComponent } from "../../forget-password/create-new-pass/create-new-pass.component";
import { PasswordResetSuccessfullComponent } from "../../forget-password/password-reset-successfull/password-reset-successfull.component";
import { WelcomeComponent } from "../../forget-password/welcome/welcome.component";
import { provideTranslocoScope, TranslocoDirective, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  imports: [PasswordComponent, SpecialSkilledOtpComponent,
    CarouselComponent, UserAuthenticationComponent,
    FindAccountComponent, AccessAccountComponent,
    ChooseYourAccountComponent,
    SecurityCodeComponent, CreateNewPassComponent,
    PasswordResetSuccessfullComponent, WelcomeComponent, TranslocoModule
  ],
  providers: [provideTranslocoScope('signin')],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private loginService = inject(LoginService)
  private sharedService = inject(SharedService);
  private title = inject(Title)

  readonly currentPanel = this.sharedService.currentPanel
  currentLanguage = 'en';
  constructor(private translocoService: TranslocoService) {

    this.translocoService.langChanges$.subscribe((lang) => {
      this.currentLanguage = lang;
    })
  };
  // readonly currentPanel = signal('otp')
  readonly isOtp = this.loginService.isOtp
  ngOnInit(): void {
    // console.log("home",this.loginService.isUsername())

  }



  backPage(panelName: rightPanel) {
    this.sharedService.updateType(panelName);
  }
}

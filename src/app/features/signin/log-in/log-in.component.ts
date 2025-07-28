import { AfterViewInit, Component, EventEmitter, inject, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { SharedService } from '../services/share.service';
import { checkUserNameRequest, checkUserNameResponse } from '../models/login.model';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subscription, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SocialMediaService } from '../services/social-media.service';
import { AuthGoogleService } from '../social-meadi-service/auth-google.service';
import { GoogleAuthService } from '../services/google-auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { CookieService } from '../../../core/services/cookie/cookie.service';
declare const google: any;
@Component({
  selector: 'app-log-in',
  imports: [InputComponent, ReactiveFormsModule, TranslocoModule, GoogleSigninButtonModule],
  providers: [provideTranslocoScope('signin')],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  private loginService = inject(LoginService)
  private sharedService = inject(SharedService)
  protected socialMediaService = inject(SocialMediaService)
  private authService = inject(AuthGoogleService);
  private googleAuthServic = inject(GoogleAuthService);
  private socialAuthService = inject(SocialAuthService);
  private cookieService = inject(CookieService)
  private title = inject(Title)
  private http = inject(HttpClient)
  private router = inject(Router)

  signInWithGoogle() {
    this.authService.login();
  }
  @Output() next = new EventEmitter<void>();
  isSubmitted = signal(false)
  maxValue = 999999999999999999999999999999999999999999999999999999999999999
  wrongUserName = signal(false)
  maxLength = 50
  signInControl = new FormControl<string | null>('', [Validators.required])

  validationText: string = ''
  isEmpty = signal(false);

  currentLanguage = 'en';
  constructor(private translocoService: TranslocoService) {
    // this.signInControl.valueChanges.pipe(takeUntilDestroyed()).subscribe({
    //   next: (v) => this.isSubmitted.set(false)
    // })
    this.translocoService.langChanges$.subscribe((lang) => {
      this.currentLanguage = lang;
    })
    this
  };
  getValidationText(): string {

    return this.validationText
  }
  private userSub!: Subscription;
  isLoading = false;
  errorMessage: string | null = null;
  ngOnInit(): void {
    this.title.setTitle('Signin')
    // this.googleAuthServic.initGoogleAuth(
    //   '656340698751-kt8lk3hujr2grfo7rnjmddb85rmg1c2q.apps.googleusercontent.com',
    //   (response: any) => this.handleGoogleResponse(response)
    // );
    this.socialAuthService.authState.subscribe((result) => {
      if (result && result.idToken) {
        this.http.post('https://gateway.bdjobs.com/bdjobs-auth-dev/api/Login/Socialmedialogin', {
          idToken: result.idToken
        }).subscribe()
      }

    })
  }
  handleGoogleSignIn(): void {
    this.googleAuthServic.openGoogleSignIn();
  }
  // private handleGoogleResponse(response: any): void {
  //   const token = response.credential;
  //   this.verifyGoogleToken(token);
  // }

  // verifyGoogleToken(token: string): void {
  //   this.isLoading = true;
  //   this.errorMessage = null;

  //   this.http.post('/api/auth/google', { token }).subscribe({
  //     next: (response: any) => {
  //       this.isLoading = false;
  //       this.router.navigate(['/dashboard']);
  //     },
  //     error: (error) => {
  //       this.isLoading = false;
  //       this.errorMessage = 'Login failed. Please try again.';
  //       console.error('Login failed:', error);
  //     }
  //   });
  // }

  // ngOnDestroy(): void {
  //   this.userSub.unsubscribe();
  // }

  ngAfterViewInit(): void {
    google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      {
        theme: "outline",
        size: "large",
        width: 250
      }
    );
  }

  // Add this to your component class
  // handleGoogleSignIn() {
  //   if (typeof google === 'undefined') {
  //     const script = document.createElement('script');
  //     script.src = 'https://accounts.google.com/gsi/client';
  //     script.async = true;
  //     script.onload = () => this.initializeGoogleSignIn();
  //     document.head.appendChild(script);
  //   } else {
  //     this.initializeGoogleSignIn();
  //   }
  // }

  private initializeGoogleSignIn() {

    google.accounts.id.initialize({
      client_id: '656340698751-kt8lk3hujr2grfo7rnjmddb85rmg1c2q.apps.googleusercontent.com', // Replace with yours
      callback: (response: any) => {

        const token = response.credential;
        const payload = JSON.parse(atob(token.split('.')[1]));


        this.http.post('/api/auth/google', { token }).subscribe({
          next: (res) => this.router.navigate(['/dashboard']), // Redirect on success
          error: (err) => console.error('Google login failed', err)
        });
      }
    });


    google.accounts.id.prompt();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.isSubmitted.set(true)
    this.isEmpty.set(true);
    this.wrongUserName.set(false)
    this.signInControl.markAsDirty()
    this.signInControl.markAllAsTouched()
    if (this.signInControl.invalid) {
      this.isEmpty.set(true);
    }
    else {
      this.sharedService.isLoading.set(true);
      const purpose = "login";
      const userObject: checkUserNameRequest = { username: this.signInControl.value || '', purpose };
      this.loginService.postUserName(userObject)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            const value = response.event
            this.sharedService.isLoading.set(false)
            if (value.eventType === 1) {
              const userobj = value.eventData[0].value
              const userInfo: checkUserNameResponse = {
                username: this.signInControl.value,
                result: userobj.result,
                fullName: userobj.fullName,
                emailAddress: userobj.emailAddress,
                guidId: userobj.guidId,
                isAccountActive: userobj.isAccountActive,
                otp: userobj.otp,
                phoneNumber: userobj.phoneNumber,
                photoUrl: userobj.photoUrl,
                status: userobj.status,
                purpose: "login"
              }
              this.sharedService.updateUserObject(userInfo);
              if (userobj.status === 0) {
                this.sharedService.updateType('otp')
              } else {
                this.sharedService.updateType('password')
              }


            }
            if (value.eventType === 2) {
              this.wrongUserName.set(true)
              this.sharedService.updateType('username')
            }

          },
          error: (error) => {
            console.error("Error in username api", error);
            this.sharedService.isLoading.set(false)
            this.wrongUserName.set(true)
          }
        })

    }



  }
  goTo() {
    this.sharedService.updateType('find-acc')
  }

  // ngAfterViewInit() {
  //   this.addGoogleSignInScript();
  // }
}

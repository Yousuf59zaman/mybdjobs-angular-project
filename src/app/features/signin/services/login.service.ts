import { inject, Injectable, signal } from '@angular/core';
// import { ApiResponse, authApiRequest, AuthApiResponse, checkUserNameRequest, checkUserNameResponse, editPasswordRequest, getUserListResponse, sendOtpRequest } from '../models/login.model';
import { map, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { checkUserNameResponse, ApiResponse, authApiRequest, AuthApiResponse, checkUserNameRequest, editPasswordRequest, getUserListResponse, sendOtpRequest } from '../models/login.model';
import { CookieService } from '../../../core/services/cookie/cookie.service';
export const localEnvironment = {
  production: false,
  authTokenCookieName: 'authToken',        
  refreshTokenCookieName: 'refreshToken',  
  apiBaseUrl: 'https://gateway.bdjobs.com/bdjobs-auth-dev/api'
};

export const productionEnvironment = {
  production: true,
  authTokenCookieName: 'authToken',       
  refreshTokenCookieName: 'RefreshTokenForJobseeker',   
  apiBaseUrl: 'https://gateway.bdjobs.com/bdjobs-auth-prod/api'
};

export type rightPanel = 'username' | 'password' | 'otp' | 'find-acc' | 'choose_acc' | 'welcome' | 'sec_code' | 'access_acc' | 'reset_pass'
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject(HttpClient)

  // private checkUserNameUrl = "https://loginsubsystem-odcx6humqq-as.a.run.app/api/Login/CheckUsername"
  private checkUserNameUrl = "https://gateway.bdjobs.com/bdjobs-auth-dev/api/Login/ChecKUsername"
  private authUrl = "https://gateway.bdjobs.com/bdjobs-auth-dev/api/Login/Login"
  private getUserListUrl = "https://accountsubsystem-52061700766.asia-southeast1.run.app/api/ForgotPassword/GetUserList";
  private sendOtpUrl = "https://mybdjobsorchestrator-52061700766.asia-southeast1.run.app/api/ForgotPassword/SendOtp";
  private forgetPasswordVerifyOtpUrl = "https://accountsubsystem-52061700766.asia-southeast1.run.app/api/ForgotPassword/ForgotPasswordVerifyOTP"
  private updatePasswordUrl = "https://accountsubsystem-52061700766.asia-southeast1.run.app/api/ForgotPassword/UpdateNewPassword";
  private supportingInfoUrl = "https://gateway.bdjobs.com/bdjobs-auth-dev/api/Login/GetSupportingInfoJobseeker";

  readonly authToken = signal<string | null>(null);
  readonly currentUserInfo = signal<any>(null);
  private readonly AUTH_STORAGE_KEY = 'authData';
  private refreshTokenUrl = "https://gateway.bdjobs.com/bdjobs-auth-dev/api/Login/GetAuthTokenByRefreshToken";
  private tokenRefreshInterval: any;
  private readonly REFRESH_INTERVAL = 20 * 1000;


  currentPanel = signal<rightPanel>('username')

  isUsername = signal(false)
  isOtp = signal(false)
  userInfo = signal<checkUserNameResponse | null>(null)


  constructor(private cookieService: CookieService) {}
  readonly selectedTab = signal<string>('Sign In');

  setTab(tab: string) {
    this.selectedTab.set(tab);
  }

  goToSignUpFlow() {
    this.updateType('username');
    this.setTab('Sign Up');
  }

  updateType(value: rightPanel) {
    this.currentPanel.set(value)
  }

  updateUserObject(value: checkUserNameResponse | null) {
    this.userInfo.set(value)
  }

  postUserName(userInformation: checkUserNameRequest): Observable<{ event: ApiResponse<checkUserNameResponse> }> {
    return this.http.post<{ event: ApiResponse<checkUserNameResponse> }>(this.checkUserNameUrl, userInformation);
  }


  getUserList(username: string): Observable<{ event: ApiResponse<getUserListResponse[]> }> {
    return this.http.get<{ event: ApiResponse<getUserListResponse[]> }>(`${this.getUserListUrl}?UserCredentials=${username}`);
  }

  getForgetPasswordVerifyOtp(UserGuidId: string, username: string, otp: string): Observable<{ event: ApiResponse<string> }> {
    return this.http.get<{ event: ApiResponse<string> }>(`${this.forgetPasswordVerifyOtpUrl}?UserGuidId=${UserGuidId}&UserName=${username}&OTP=${otp}`);
  }

  postSendOtp(sendOtpRequest: sendOtpRequest): Observable<any> {
    return this.http.post<any>(this.sendOtpUrl, sendOtpRequest)
  }

  updateNewPassword(userInfo: editPasswordRequest): Observable<ApiResponse<string>[]> {
    return this.http.put<ApiResponse<string>[]>(this.updatePasswordUrl, userInfo)
  }

   getAuthTokenFromCookie(): string | null {
    return this.cookieService.getCookie('authToken');
  }


  getSupportingInfo(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(this.supportingInfoUrl, { headers }).pipe(
      tap(response => {
        if (response.event.eventType === 1) {
          this.currentUserInfo.set(response.event.eventData[0].value.currentUser);
        }
      })
    );
  }


   setAuthData(response: any): void {
    const authData = {
      token: response.event.eventData[0]?.value?.token,
      refreshToken: response.event.eventData[0]?.value?.refreshToken,
      isBdjobsPro: response.event.eventData[0]?.value?.currentUser?.bdjobsPro?.isProUser || false
    };

    localStorage.setItem(this.AUTH_STORAGE_KEY, JSON.stringify(authData));

    // this.setAuthCookies(response);
  }

//   private setAuthCookies(response: any): void {
//   const token = response.event.eventData[0]?.value?.token;
//   const isPro = response.event.eventData[0]?.value?.currentUser?.bdjobsPro?.isProUser;
//   const userGuidId = response.event.eventData[0]?.value?.currentUser?.userGuidId;

//   if (token) {
//     this.cookieService.setCookie('authToken', token, 1);
//   }

//   if (isPro !== undefined) {
//     this.cookieService.setCookie('IsBdjobsPro', isPro.toString(), 1);
//   }

//   if (userGuidId) {
//     this.cookieService.setCookie('MybdjobsGId', encodeURIComponent(userGuidId), 1);
//   }
// }


  stopTokenRefreshTimer(): void {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = null;
    }
  }

  refreshAuthToken(refreshToken: string): Observable<any> {
    return this.http.get<any>(`${this.refreshTokenUrl}?refreshToken=${refreshToken}`);
  }



postUserPassword(body: authApiRequest): Observable<{ event: ApiResponse<AuthApiResponse> }> {
  return this.http.post<{ event: ApiResponse<AuthApiResponse> }>(this.authUrl, body).pipe(
    tap(response => {
      if (response.event.eventType === 1) {
        this.handleSuccessfulLogin(response);
      }
    })
  );
}


getAuthData(): { token: string; isBdjobsPro: boolean; refreshToken: string } | null {
  const data = localStorage.getItem(this.AUTH_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

startTokenRefreshTimer(refreshToken: string): void {
  this.stopTokenRefreshTimer();
  this.tokenRefreshInterval = setInterval(() => {
    this.refreshAuthToken(refreshToken).subscribe({
      next: (response) => {
        if (response.event.eventType === 1) {
          const newToken = response.event.eventData[0].value.token;
          const newRefreshToken = response.event.eventData[0].value.refreshToken;
          
          this.authToken.set(newToken);
          this.cookieService.setCookie(productionEnvironment.authTokenCookieName, newToken, 1);
          this.cookieService.setCookie(productionEnvironment.refreshTokenCookieName, newRefreshToken, 1);
          
          // Restart timer with new refresh token
          this.startTokenRefreshTimer(newRefreshToken);
          
          // Update localStorage
          this.setAuthData(response);
        }
      },
      error: (error) => {
        console.error('Token refresh failed:', error);
        this.stopTokenRefreshTimer();
      }
    });
  }, this.REFRESH_INTERVAL);
}

private handleSuccessfulLogin(response: any): void {
  const token = response.event.eventData[0]?.value?.token;
  const refreshToken = response.event.eventData[0]?.value?.refreshToken;
  
  if (token && refreshToken) {
    this.cookieService.setCookie(productionEnvironment.authTokenCookieName, token, 1);
    this.cookieService.setCookie(productionEnvironment.refreshTokenCookieName, refreshToken, 1);
    this.startTokenRefreshTimer(refreshToken);
    this.setAuthData(response);
  }
}

}

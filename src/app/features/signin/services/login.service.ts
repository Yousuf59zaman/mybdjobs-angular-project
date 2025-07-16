import { inject, Injectable, signal } from '@angular/core';
// import { ApiResponse, authApiRequest, AuthApiResponse, checkUserNameRequest, checkUserNameResponse, editPasswordRequest, getUserListResponse, sendOtpRequest } from '../models/login.model';
import { map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { checkUserNameResponse, ApiResponse, authApiRequest, AuthApiResponse, checkUserNameRequest, editPasswordRequest, getUserListResponse, sendOtpRequest } from '../models/login.model';

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
  private updatePasswordUrl = "https://accountsubsystem-52061700766.asia-southeast1.run.app/api/ForgotPassword/UpdateNewPassword"


  currentPanel = signal<rightPanel>('username')

  isUsername = signal(false)
  isOtp = signal(false)
  userInfo = signal<checkUserNameResponse | null>(null)


  constructor() { }
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
    console.log("current Panel", value);

  }

  updateUserObject(value: checkUserNameResponse | null) {
    this.userInfo.set(value)
    console.log("Service Obj:", this.userInfo())
  }

  postUserName(userInformation: checkUserNameRequest): Observable<{ event: ApiResponse<checkUserNameResponse> }> {
    return this.http.post<{ event: ApiResponse<checkUserNameResponse> }>(this.checkUserNameUrl, userInformation);
  }

  postUserPassword(body: authApiRequest): Observable<{ event: ApiResponse<AuthApiResponse> }> {
    return this.http.post<{ event: ApiResponse<AuthApiResponse> }>(this.authUrl, body, { withCredentials: true })
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
}

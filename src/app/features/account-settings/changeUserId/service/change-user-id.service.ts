import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiEventResponse, CheckUserInfoResponse, CheckUserNameExist, CheckUserNameExistResponse, SendOtpCodeInEmail, SendOtpData, UpdateUserInfoResponse } from '../model/change-user-id';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChangeUserIdService {
  private readonly getApi = 'https://accountsubsystem-odcx6humqq-as.a.run.app/api/AccountSettings/CheckUserNameExist';
  private readonly postOtpApi = 'https://mybdjobsorchestrator-odcx6humqq-as.a.run.app/api/CreateAccountOrchestrator/SendOtpForUpdateUserName';
  private readonly verifyOtpApi = 'https://accountsubsystem-odcx6humqq-as.a.run.app/api/ForgotPassword/ForgotPasswordVerifyOTP';
  private readonly updateUserNameApi = 'https://accountsubsystem-odcx6humqq-as.a.run.app/api/AccountSettings/UpdateAccount';
  private readonly checkUserInfoApi = 'https://accountsubsystem-odcx6humqq-as.a.run.app/api/AccountSettings/GetUserNameTypeInfo';

  constructor(private http: HttpClient) { }

 checkUserInfo(data: { userGuid: string }): Observable<CheckUserInfoResponse> {
    const params = new HttpParams().set('UserGuid', data.userGuid);
    return this.http.get<CheckUserInfoResponse>(this.checkUserInfoApi, { params });
  }
  checkUserNameExist(data: CheckUserNameExist): Observable<CheckUserNameExistResponse> {
    const params = new HttpParams()
      .set('UserGuid', data.UserGuid)
      .set('NewUserName', data.NewUserName)
      .set('OldPassword', data.OldPassword || '');
    return this.http.get<CheckUserNameExistResponse>(this.getApi, { params });
  }

  sendOtp(data: { userGuid: string, currentUserName: string, newUserName: string }): Observable<ApiEventResponse[]> {
    return this.http.post<ApiEventResponse[]>(this.postOtpApi, {
      userGuid: data.userGuid,
      userName: data.currentUserName,
      newUserName: data.newUserName
    });
  }

  verifyOtpCode(data: SendOtpData): Observable<CheckUserNameExistResponse> {
    const params = new HttpParams()
      .set('UserGuidId', data.UserGuidId)
      .set('UserName', data.UserName)
      .set('OTP', data.OTP);
    return this.http.get<CheckUserNameExistResponse>(this.verifyOtpApi, { params });
  }
  updateUserNameInfo(data: { userGuid: string, newUserName: string, userType: number }): Observable<UpdateUserInfoResponse[]> {
    return this.http.put<UpdateUserInfoResponse[]>(this.updateUserNameApi, {
      UserGuid: data.userGuid,
      NewUserName: data.newUserName,
      UserType: data.userType
    });
  }
}
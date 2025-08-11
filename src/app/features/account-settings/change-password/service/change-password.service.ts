import { Injectable } from '@angular/core';
import { ChangePasswordRequest } from '../models/change-password.model';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChangePasswordService {
  constructor(private http: HttpClient) {}

  changePassword(
    request: ChangePasswordRequest,
    headers: HttpHeaders
  ): Observable<any> {
    console.log('Sending change password request:', request);
    return this.http
      .put(
        'https://accountsubsystem-odcx6humqq-as.a.run.app/api/AccountSettings/ChangePassword',
        request,
        { headers }
      )
      .pipe(
        tap((response) => console.log('Change password response:', response)),
        catchError((error) => {
          console.error('Change password error:', error);
          return throwError(() => error);
        })
      );
  }

  sendOtpForUpdateUserName(
    payload: any,
    headers: HttpHeaders
  ): Observable<any> {
    return this.http
      .post(
        'https://mybdjobsorchestrator-odcx6humqq-as.a.run.app/api/CreateAccountOrchestrator/SendOtpForUpdateUserName',
        payload,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Error sending OTP:', error);
          return throwError(() => error);
        })
      );
  }
}

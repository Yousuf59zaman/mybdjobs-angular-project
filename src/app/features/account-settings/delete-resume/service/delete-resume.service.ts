import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  DeleteResumeOtpQuery,
  DeleteResumeQuery,
  SendOtpRequest,
} from '../model/delete-resume';

function toHttpParams(obj: any): HttpParams {
  let params = new HttpParams();
  for (const key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      obj[key] !== null &&
      obj[key] !== undefined
    ) {
      params = params.set(key, obj[key]);
    }
  }
  return params;
}

@Injectable({ providedIn: 'root' })
export class DeleteResumeService {
  static readonly SEND_OTP_API_URL =
    'https://mybdjobsorchestrator-odcx6humqq-as.a.run.app/api/CreateAccountOrchestrator/SendOtpForUpdateUserName';
  static readonly DELETE_RESUME_API_URL =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/DeleteResume';

  constructor(private http: HttpClient) {}

  deleteResume(query: DeleteResumeQuery): Observable<any> {
    const params: HttpParams = toHttpParams(query);
    return this.http
      .post<any>(DeleteResumeService.DELETE_RESUME_API_URL, null, { params })
      .pipe(
        catchError((error) => {
          const errorMsg = 'Failed to delete resume. Please try again later.';
          return throwError(() => new Error(errorMsg));
        }),
      );
  }

  sendOtpForDeleteResume(request: SendOtpRequest): Observable<any> {
    return this.http
      .post<any>(DeleteResumeService.SEND_OTP_API_URL, request)
      .pipe(
        catchError((error) => {
          const errorMsg =
            'Failed to send verification code. Please try again.';
          return throwError(() => new Error(errorMsg));
        }),
      );
  }

  verifyOtpAndDeleteResume(query: DeleteResumeOtpQuery): Observable<any> {
    const params: HttpParams = toHttpParams(query);
    return this.http
      .post<any>(DeleteResumeService.DELETE_RESUME_API_URL, null, { params })
      .pipe(
        catchError((error) => {
          const errorMsg = 'Failed to delete resume. Please try again later.';
          return throwError(() => new Error(errorMsg));
        }),
      );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OtpApiResponse, OtpData, serviceData } from '../model/otpverify';

@Injectable({
  providedIn: 'root'
})
export class OtpVerifyService {
  private postUrl = 'https://accountsubsystem-52061700766.asia-southeast1.run.app/api/CreateAccount/VerifyOtpAndCreateAccount';
  private readonly serviceAPIUrl = 'https://gateway.bdjobs.com/bdjobs-auth-dev/api/Login/ServicesAuth'

  constructor(private http: HttpClient) {}

  submitOtpCode(otpCodeData: OtpData): Observable<OtpApiResponse> {
    return this.http.post<OtpApiResponse>(this.postUrl, otpCodeData);
  }

  executeService(serviceRequest: serviceData):Observable<any>{
    return this.http.post<any>(this.serviceAPIUrl, serviceRequest)
  }
}

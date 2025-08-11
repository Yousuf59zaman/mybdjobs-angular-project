import { HttpParams } from '@angular/common/http';

export interface DeleteResumeQuery {
  UserGuid: string;
  UserName: string;
  Password?: string;
  Reason?: string;
  IsSocialMedia?: number;
  SocialMediaId?: string;
  SMDBtable?: string;
  SocialMediaType?: string;
  OTPCode?: string;
}

export interface SendOtpRequest {
  userGuid: string;
  userName: string;
  isForDeleteResume: boolean;
}

export interface DeleteResumeOtpQuery {
  userGuid: string;
  UserName: string;
  OTPCode?: string;
}

export function toHttpParams(input: DeleteResumeQuery): HttpParams {
  let params = new HttpParams();
  Object.keys(input).forEach((key) => {
    const value = (input as any)[key];
    if (value !== null && value !== undefined && value !== '') {
      params = params.append(
        key,
        key === 'IsSocialMedia' ? value.toString() : value,
      );
    }
  });
  return params;
}

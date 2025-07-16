import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CheckDuplicateUserEventResponse {
  event: {
    eventType: number;
    eventData: { key: string; value: string }[];
    eventId: number;
  };
}

export interface CreateAccountRequest {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  status: number;
  mobile: string;
  workAreaCategory: number;
  createdFrom: number;
  createdAt: string;
  decodeId: string;
  catTypeId: number;
  userNameType: string;
  disabilityId: string;
  deviceTypeId: number;
  countryCode: string;
  socialMediaId: number;
  socialMediaName: string;
  socialMediaTimestamp: string;
  ttcId: string;
  gradeId: string;
  knownBy: string;
  isTtc: boolean;
  trainingCenterName: string;
  trainingDistrict: string;
  queryString: string;
  campaignId: number;
  campaignSource: string;
  campaignReferer: string;
  isFromSocialMedia: boolean;
  isActive: number;
  useType: string;
  uNtype: number;
}

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {
  private readonly checkDuplicateUserUrl = 'https://accountsubsystem-52061700766.asia-southeast1.run.app/api/CreateAccount/CheckDuplicateUser';
  private readonly createAccountUrl = 'https://mybdjobsorchestrator-odcx6humqq-as.a.run.app/api/CreateAccountOrchestrator/CreateAccount';

  private createdEmail: string | null = null;
  private createdGuid: string | null = null;
  private createdTempId: string | null = null;
  private createdPhone: string | null = null;
  private createdWorkAreaCategory: number | null = null;
  private accountType: string | null = null;
  private userNameType: string | null = null;

  constructor(private http: HttpClient) {}

  setCreatedAccountInfo(email: string, guid: string) {
    this.createdEmail = email;
    this.createdGuid = guid;
  }

  setMobileAccountInfo(tempId: string, phone: string) {
    this.createdTempId = tempId;
    this.createdPhone = phone;
  }

  setWorkAreaCategory(category: number) {
    this.createdWorkAreaCategory = category;
  }

  setAccountType(type: string) {
    this.accountType = type;
  }

  setUserNameType(type: string) {
    this.userNameType = type;
  }

  setCreatedGuid(guid: string) {
    this.createdGuid = guid;
  }

  getCreatedEmail(): string | null {
    return this.createdEmail;
  }

  getCreatedGuid(): string | null {
    return this.createdGuid;
  }

  getCreatedTempId(): string | null {
    return this.createdTempId;
  }

  getCreatedPhone(): string | null {
    return this.createdPhone;
  }

  getWorkAreaCategory(): number | null {
    return this.createdWorkAreaCategory;
  }

  getAccountType(): string | null {
    return this.accountType;
  }

  getUserNameType(): string | null {
    return this.userNameType;
  }

  checkDuplicateUser(params: {
    Email?: string;
    Phone?: string;
    FullName?: string;
    UserName?: string;
    SocialMediaId?: string;
  }): Observable<CheckDuplicateUserEventResponse> {
    let httpParams = new HttpParams();
    
    if (params.Email) httpParams = httpParams.set('Email', params.Email);
    if (params.Phone) httpParams = httpParams.set('Phone', params.Phone);
    if (params.FullName) httpParams = httpParams.set('FullName', params.FullName);
    if (params.UserName) httpParams = httpParams.set('UserName', params.UserName);
    if (params.SocialMediaId) httpParams = httpParams.set('SocialMediaId', params.SocialMediaId);

    return this.http.get<CheckDuplicateUserEventResponse>(this.checkDuplicateUserUrl, { params: httpParams });
  }

  createAccount(payload: CreateAccountRequest) {
    const headers = new HttpHeaders({
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.createAccountUrl, payload, { headers });
  }
} 
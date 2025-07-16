import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DisabilityApiResponse } from '../models/disability-info-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisabilityInfoService {

private readonly url = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetDisAbilityInfo';
private readonly postUrl = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/UpdateDisabilityInfo'

  constructor(private http: HttpClient) {}

  getByUserGuid(userGuid: string): Observable<DisabilityApiResponse> {
    const params = new HttpParams().set('userGuid', userGuid);
    return this.http.get<DisabilityApiResponse>(this.url, { params });
  }
  saveData(payload: any) {
    return this.http.post(this.postUrl, payload);
  }
}

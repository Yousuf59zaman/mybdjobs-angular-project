import { map } from 'rxjs/operators';
import {
  GetOtherRelevantInfoQuery,
  GetOtherRelevantInfoResponse,
  OtherRelevantInfo,
  UpdateOtherRelevantInfo
} from '../model/other-relevantInfo';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OtherRelevantInfoService {
  private getApi    = ' https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetOtherRelevantInfo';
  private updateApi = ' https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/UpdateOtherRelevantInfo';

  constructor(private http: HttpClient) { }

  getOtherInfo(query: string): Observable<OtherRelevantInfo> {
    const params = new HttpParams().set('userGuid', query);
    return this.http
      .get<GetOtherRelevantInfoResponse>(this.getApi, { params })
      .pipe(
        map(res => {
          const entry = res.event
                           .eventData?.[0]
                           ?.value;
          return entry ?? { careeR_SUMMARY: '', spequa: '', keywords: '' };
        })
      );
  }

  updateOtherInfo(command: UpdateOtherRelevantInfo): Observable<void> {
    return this.http.post<void>(this.updateApi, command);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericApiResponse } from '../../../shared/models/response';
import { DashboardStatsResponse, DashboardInfoPayload, DashboardInfoResponse, DashboardStatsPayload, DashboardPersonalInfoResponse, DashboardRightPanelData, ProStatInfo } from '../models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  private basUrl = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/';

  constructor() { }

  getPersonalDashboardInfo(userGuid: string): Observable<GenericApiResponse<DashboardPersonalInfoResponse>> {
    const url = this.basUrl+'GetPackageAndPoints';

    const params = new HttpParams().set('UserGuid', userGuid);
    
    return this.http.get<GenericApiResponse<DashboardPersonalInfoResponse>>(url, { params });
  }

  getDashBoardProgressInfo(userGuid: string): Observable<GenericApiResponse<DashboardRightPanelData>> {
    const url = this.basUrl+'GetDashBoardProgressInfo';

    const params = new HttpParams().set('UserGuid', userGuid);

    return this.http.get<GenericApiResponse<DashboardRightPanelData>>(url, { params });
  }

  getGeneralStatInfo(payload: DashboardInfoPayload): Observable<GenericApiResponse<DashboardInfoResponse>> {
    const url = this.basUrl+'GetDashBoardInfo';

    const params = new HttpParams()
      .set('UserGuid', payload.userGuid)
      .set('NumberOfDays', payload.numberOfDays)
    
    return this.http.get<GenericApiResponse<DashboardInfoResponse>>(url, { params });
  }

  getGeneralStatGraphInfo(payload: DashboardStatsPayload): Observable<GenericApiResponse<DashboardStatsResponse[]>> {
    const url = this.basUrl+'GetDashBoardStats';

    const params = new HttpParams()
      .set('UserGuid', payload.userGuid)
      .set('DateGroupingOption', payload.dateGroupingOption)
    
    return this.http.get<GenericApiResponse<DashboardStatsResponse[]>>(url, { params });
  }

  getDashboardProStatInfo(userGuid: string): Observable<GenericApiResponse<ProStatInfo[]>>{
    const url = this.basUrl+'GetDashBoardProStats';
    
    const params = new HttpParams().set('UserGuid', userGuid);

    return this.http.get<GenericApiResponse<ProStatInfo[]>>(url, {params});
  }
}

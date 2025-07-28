// src/app/services/shortlisted-job.service.ts
import { Injectable }       from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable }       from 'rxjs';
import { map }              from 'rxjs/operators';
import { ApiResponse, DeleteShortlistedJobsRequest, ShortlistedJob, ShortlistedJobsRequest } from '../models/shortlisted_job';

@Injectable({ providedIn: 'root' })
export class ShortlistedJobService {
  private apiUrl = 'https://useractivitysubsystem-odcx6humqq-as.a.run.app/api/ShortlistedJob/ShortListedJobList';
  private deleteUrl = 'https://useractivitysubsystem-odcx6humqq-as.a.run.app/api/ShortlistedJob/ShortlistedJob';


  constructor(private http: HttpClient) {}

  getShortlistedJobs(req: ShortlistedJobsRequest): Observable<ShortlistedJob[]> {
    let params = new HttpParams()
      .set('CurrentPage',  req.CurrentPage.toString())
      .set('UserGuid',       req.GuidId.toString())
      .set('PerPageData',  req.PerPageData.toString())
      .set('LanType',      req.LanType)
      .set('SearchData',   req.SearchData  ?? '')
      .set('FromDate',     req.FromDate    ?? '')
      .set('ToDate',       req.ToDate      ?? '');

    return this.http
      .get<ApiResponse<ShortlistedJob>>(this.apiUrl, { params, withCredentials: true })
      .pipe(
        map(res => {
          const entry = res.eventData.find(e => e.key === 'ShortlistedJobs');
          return entry?.value ?? [];
        })
      );
  }

  deleteShortlistedJobs(req: DeleteShortlistedJobsRequest): Observable<void> {

    return this.http.delete<void>(this.deleteUrl, { body: req,withCredentials: true });
  }
}

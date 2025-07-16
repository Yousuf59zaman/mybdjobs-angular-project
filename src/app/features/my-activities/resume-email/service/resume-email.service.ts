import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeleteResume, EmailResponse, GetEmailedResumeQuery, GetEmailedResumeResponse } from '../interface/resume-email';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeEmailService {

  private getApi = 'https://useractivitysubsystem-odcx6humqq-as.a.run.app/api/EmailedResume/GETResumeEmailed';
  private deleteApi = 'https://useractivitysubsystem-odcx6humqq-as.a.run.app/api/EmailedResume/DeleteResume';

  constructor(private http: HttpClient) {}

  getEmailedResumes(query: GetEmailedResumeQuery): Observable<GetEmailedResumeResponse[]> {
    let params = new HttpParams()
      .set('PageNo', query.PageNo)
      .set('userGuid', query.UserGuid)
      .set('PageSize', query.PageSize)
      .set('LanType', query.LanType);

    if (query.cvType !== null && query.cvType !== undefined) {
      params = params.set('cvType', query.cvType);
    }

    if (query.FromDate) params = params.set('FromDate', query.FromDate);
    if (query.SearchToDate) params = params.set('SearchToDate', query.SearchToDate);
    if (query.SearchSubjectName) params = params.set('SearchSubjectName', query.SearchSubjectName);

    return this.http.get<any>(this.getApi, { params, withCredentials : true }).pipe(
      map(response => response.event.eventData[0].value || [])
    );
  }
  deleteResume(data: DeleteResume): Observable<EmailResponse> {
    return this.http.delete<EmailResponse>(this.deleteApi, { body: data, withCredentials : true });
  }
  
}

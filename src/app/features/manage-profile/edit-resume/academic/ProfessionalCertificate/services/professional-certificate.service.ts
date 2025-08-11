import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { InsertProfessionalCertificate, PostApiResponse, ProfessionalCertificationPayload, ProfessionalCertificationResponse } from '../models/professinal-certification-model';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalCertificateService {

  private apiUrl = "https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetProfessionalCertificationSummary"
  private updateUrl ="https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/UpdateProfessionalSummary"
  private deleteUrl ="https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/DeleteProfessionalSummary"
  private insertUrl ="https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/InsertProfessionalSummary"
  constructor(private http: HttpClient) { }

  getCertifications(UserGuid: string) {
    return this.http.get<ProfessionalCertificationResponse>(this.apiUrl, { params: {UserGuid }});
  }
  updateCertification(payload: ProfessionalCertificationPayload): Observable<any> {
    return this.http.post<any>(this.updateUrl, payload);
  }
  deleteCertification(prqId: number, UserGuid: string ):Observable<PostApiResponse[]>
  {  
      const params = new HttpParams()
    .set('prqId', prqId.toString())
    .set('UserGuid', UserGuid);
    return this.http.delete<PostApiResponse[]>(this.deleteUrl, { params });
  }
  createCertification(payload: InsertProfessionalCertificate) : Observable<any>
  {
    return this.http.post<any>(this.insertUrl, payload)
  }
}

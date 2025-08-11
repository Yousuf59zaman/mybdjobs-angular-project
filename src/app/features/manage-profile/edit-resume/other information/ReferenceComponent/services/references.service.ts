import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DeleteReferencePayload,
  EventResponse,
  InsertReferencePayload,
  UpdateReferencePayload,
} from '../models/referenceModel';

@Injectable({
  providedIn: 'root',
})
export class ReferencesService {
  private getUrl = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetReference';
  private updateUrl = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/UpdateReference';
  private insertUrl = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/InsertReference';
  private deleteUrl ='https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/DeleteReference';
  constructor(private http: HttpClient) {}
  getReference(UserGuid: string): Observable<EventResponse> {
    const params = new HttpParams().set('UserGuid', UserGuid);
    return this.http.get<EventResponse>(this.getUrl, { params });
  }
  updateReference(payload: UpdateReferencePayload): Observable<any> {
    return this.http.post(this.updateUrl, payload);
  }
  insertReference(payload: InsertReferencePayload): Observable<any> {
    return this.http.post(this.insertUrl, payload)
  }
  deleteReference(userGuid:string, referenceId:number):Observable<any>{
      const params = new HttpParams()
    .set('referenceId', referenceId)
    .set('UserGuid', userGuid);
    return this.http.delete(this.deleteUrl,{params})
  }
}

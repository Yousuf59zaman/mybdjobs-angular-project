import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CareerInfoResponse, GetCareerInfoQuery, UpdateCareerInfo } from '../model/career-application-info';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CareerApplicationInfoServiceService {

  private getApi = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetCareerInfo';
  private updateApi='https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/UpdateCareerInfo';
 

  constructor(private http: HttpClient) { }

  getCareerInfo(query: GetCareerInfoQuery): Observable<CareerInfoResponse> {
    const params = new HttpParams().set('UserGuid', query.UserGuid);
    return this.http.get<CareerInfoResponse>(this.getApi, { params });
  }

  updateCareerInfo(command: UpdateCareerInfo): Observable<void> {
    return this.http.post<void>(this.updateApi, command);
  }
}

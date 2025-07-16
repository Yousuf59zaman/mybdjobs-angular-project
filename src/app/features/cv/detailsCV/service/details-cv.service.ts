import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetDetailsCvViewInfoRequest } from '../interface/detailsCvInterface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class DetailsCVService {

  private detailsCV = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetCvViewInfo';

  constructor(private http: HttpClient) { }
  getDetailsCv(request: GetDetailsCvViewInfoRequest): Observable<any> {
    return this.http.get<any>(`${this.detailsCV}?userGuid=${request.UserGuid}`);
   }
}

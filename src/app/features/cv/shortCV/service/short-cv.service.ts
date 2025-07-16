import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { GetShortCvViewInfoRequest, GetShortCvViewInfoResponse } from '../interface/shortCVInterface';
@Injectable({
  providedIn: 'root'
})
export class ShortCVService {

  private shortCVApi = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetShortCvViewInfo'; 
  constructor(private http: HttpClient) {}
  getShortCv(request: GetShortCvViewInfoRequest): Observable<any> {
    return this.http.get<any>(`${this.shortCVApi}?userGuid=${request.UserGuid}`);
  }
}


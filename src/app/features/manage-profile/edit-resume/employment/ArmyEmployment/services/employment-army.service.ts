import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GetEventResponse, PostApiReponse, PostArmyDetails } from '../models/armyEmploymentModel';

@Injectable({
  providedIn: 'root'
})
export class EmploymentArmyService {
   private readonly baseUrl = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetRetiredArmyEmploymentHistory';
   private readonly postUrl ='https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/InsertOrUpdateRetiredArmyInfo';
   private readonly deleteUrl ='https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/DeleteRetiredArmyHistory'
  constructor(private http: HttpClient) { }
   getRetiredArmyMessages(UserGuid: string): Observable<any> {    
    return this.http.get<GetEventResponse>(this.baseUrl,{ params: {UserGuid }})
  }
  postRetiredArmy(payload:PostArmyDetails):Observable<any>{
    return this.http.post<PostApiReponse>(this.postUrl, payload)
  }
  deleteRetiredArmy(userGuidId: string ):Observable<any>{
    const body = { userGuidId };


  return this.http.delete<any>(
    this.deleteUrl,
    { body }
  );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable, tap } from 'rxjs';
import { ApiResponse, PersonalInfoApiResponse } from '../models/personal-info-model';
@Injectable({
  providedIn: 'root'
})
export class PersonalInformationService {
  private personalInfoData: ApiResponse | null = null;
  private apiUrl= "https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/JobSeekerResume/GetPersonalDetails"
   private personalInfoSubject = new BehaviorSubject<ApiResponse | null>(null);

  // Expose public observable for components
  public personalInfo$ = this.personalInfoSubject.asObservable().pipe(
    distinctUntilChanged() // Prevent duplicate emissions
  );


  constructor(private http:HttpClient) { }


  getPersonalInfo(UserGuid: string, isCvPosted: number): Observable<ApiResponse> {
    const params = {
      UserGuid: UserGuid.toString(),
      isCvPosted: isCvPosted.toString()
    };

    return this.http.get<ApiResponse>(this.apiUrl, { params }).pipe(
      tap(response => {
        this.personalInfoData = response;
        this.personalInfoSubject.next(response);

      })
    );
  }

  get getUserPhoto(): string | null {
    if (!this.personalInfoData) {
      return null;
    }
    var response= this.personalInfoData.event.eventData.find(d => d.key === 'message');
    return response?.value.photo ?? null;
  }

}

import { inject, Injectable } from '@angular/core';
//import {PersonalInfoApiResponse} from '../models/personal-info-model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, shareReplay, startWith, Subject, switchMap, tap } from 'rxjs';
import {
  ApiResponse,
  AutoSuggestionRequest,
  AutoSuggestionResponse,
  PersonalDetailsPayload,
} from '../models/PersonalInfoPayload';
import { PersonalInformationService } from '../../services/personal-information.service';


@Injectable({
  providedIn: 'root',
})
export class PersonalDetailsFormService {
  private personalInfoService = inject(PersonalInformationService);
  private apiUrl =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/JobSeekerResume/GetPersonalDetails';
  private postUrl =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/UpdatePersonalInfo';
  private autoSuggestionUrl =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/AutoSuggestion';

  constructor(private http: HttpClient) {}
  userguid: string = "";
  isCvPosted: number= 1;

  cachedData = this.personalInfoService.personalInfo$;
  
  

  savePersonalInfo(payload: PersonalDetailsPayload): Observable<ApiResponse[]> {
    return this.http.post<ApiResponse[]>(this.postUrl, payload);
  }

  getSuggestions(strData: string): Observable<AutoSuggestionResponse> {
    const payload = {
      condition: '',
      banglaField: '',
      con1: '1',
      examTitle: '',
      langType: '',
      param: '1',
      strData: strData,
    };
    return this.http.post<AutoSuggestionResponse>(
      this.autoSuggestionUrl,
      payload
    );
  }
}

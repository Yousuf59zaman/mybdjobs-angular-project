import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, catchError, tap, throwError, of } from 'rxjs';
import { PrivacyStatusEvent, AvailabilityStatusRequest, AvailabilityStatusResponseEvent, VideoResumeStatusRequest, CompanySuggestionRequest, AutoSuggestionEventResponse, VideoResumeResponseEvent, ProfileVisibilityResponseEvent, ProfileVisibilityRequest } from '../model/profilepreferences';


@Injectable({
  providedIn: 'root'
})
export class ProfilePreferenceService {
  private readonly apiUrl = 'https://accountsubsystem-odcx6humqq-as.a.run.app/api/AccountSettings/GetPrivacyStatus';
  private readonly updateAvailabilityUrl = 'https://accountsubsystem-odcx6humqq-as.a.run.app/api/AccountSettings/UpdateAvailabilityStatus';
  private readonly updateVideoResumeUrl = 'https://accountsubsystem-odcx6humqq-as.a.run.app/api/AccountSettings/IsVideoResumeShow';
  private readonly autosuggestUrl = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/AutoSuggestion';
  private readonly updateProfileVisibilityApiUrl = 'https://accountsubsystem-odcx6humqq-as.a.run.app/api/AccountSettings/BlockEmplyer';

  constructor(private http: HttpClient) {}

  getProfilePreferences(query: string): Observable<any> {   
    const params = new HttpParams().set('userGuid', query);
    return this.http.get<PrivacyStatusEvent>(this.apiUrl, { params })
  }

  putAvailabilityStatus(userGuid: string, isAvailable: boolean): Observable<AvailabilityStatusResponseEvent[]> {
    const body: AvailabilityStatusRequest = {
      userGuid,
      isAvailable
    };
    return this.http.put<AvailabilityStatusResponseEvent[]>(this.updateAvailabilityUrl, body);
  }

  putVideoResumeStatus(userGuid: string, isAvailable: boolean): Observable<VideoResumeResponseEvent[]> {
    const body: VideoResumeStatusRequest = {
      userGuid,
      isAvailable
    };
    return this.http.put<VideoResumeResponseEvent[]>(this.updateVideoResumeUrl, body);
  }
   putProfileVisibilityStatus(userGuid: string, corporateIds: string, option: number): Observable<ProfileVisibilityResponseEvent[]> {
    const body: ProfileVisibilityRequest = {
      userGuid,
      corporateIds,
      option
    };
    return this.http.put<ProfileVisibilityResponseEvent[]>(this.updateProfileVisibilityApiUrl, body);
  }
 getCompanySuggestions(searchTerm: string): Observable<AutoSuggestionEventResponse> {
    const payload: CompanySuggestionRequest = {
      strData: searchTerm,
      langType: 'en', // Default to English
      param: '8'      // Always request companies
    };

    return this.http.post<AutoSuggestionEventResponse>(this.autosuggestUrl, payload);
  }
}

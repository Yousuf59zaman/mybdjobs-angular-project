import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Education, EducationPost, GetBoardNameAPIResponse, GetBoardNames, Institute, InstituteResponse, InstituteSearchPayload } from '../education/models/education';
import { IsNotEmptyObject } from '../../../../shared/utils/functions';

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  // Replace with your actual API endpoint URL
  private apiUrl = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetUserEducation';
  private instituteApiUrl = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/AutoSuggestion';
  private postApiUrl = 'https://accountsubsystem-52061700766.asia-southeast1.run.app/api/CreateAccount/InsertEducation';

  constructor(private http: HttpClient) {}
  getUserEducationData(payload: any): Observable<GetBoardNames> {
    let params = new HttpParams();
    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      if (key === 'lang') {
        // Map "lang" to "strVersion" as expected by the API.
        params = params.set('strVersion', value);
      } else if (key === 'eCode') {
        // Map "eCode" to "E_Code" and convert to integer (if needed).
        const intValue = typeof value === 'string' ? parseInt(value, 10) : value;
        params = params.set('E_Code', intValue != null ? intValue.toString() : '');
      } else {
        params = params.set(key, value != null ? value.toString() : '');
      }
    });
    return this.http.get<GetBoardNameAPIResponse<GetBoardNames>>(this.apiUrl, { params }).pipe(
      map((response) => {
        const eventData = response.event.eventData.find(
          (d: { key: string; value: string | GetBoardNames; }) => d.key === 'message'
        )?.value;
        // If eCode was provided, return only educationDegrees
        if (payload.eCode !== undefined) {
          return {
            educationDegrees: (eventData as GetBoardNames).educationDegrees,
            boardNames: (eventData as GetBoardNames).boardNames
          } as GetBoardNames;
        }
        return eventData as GetBoardNames;
      })
    );
  }

  postUserEducation(data: EducationPost): Observable<any> {
    return this.http.post<any>(this.postApiUrl, data).pipe(
      tap(response => console.log('POST Education response:', response))
    );
  }

  getInstituteSuggestions(payload: InstituteSearchPayload): Observable<Institute[]> {
    return this.http.post<GetBoardNameAPIResponse<InstituteResponse[]>>(this.instituteApiUrl, payload).pipe(
      tap((res) => console.log('Institute Suggestion API response:', res)),
      map((response) => {
        // Response structure: eventData is an array with one object where key = "Message"
        let suggestions: Institute[] = [];
        const eventData = response.event.eventData.find((d: any) => d.key === 'message')?.value;
        if (eventData && IsNotEmptyObject(eventData)) {
          eventData.forEach((item: InstituteResponse) => {
            if (IsNotEmptyObject(item.instituteResponse) && item.instituteResponse.length) {
              suggestions.push(...item.instituteResponse);
            }
          });
        }
        return suggestions;
      })
    );
  }
  
}

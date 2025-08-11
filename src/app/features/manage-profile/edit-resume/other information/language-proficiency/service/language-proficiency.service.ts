import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  deleteLanguage,
  insertLanguage,
  LanguageInfoResponse,
  LanguageQuery,
  LanguageResponse,
  updateLanguage,
} from '../model/language-proficiency';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageProficiencyService {
  private readonly getApiUrl =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetLanguageProficiency';
  private readonly insertApi =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/InsertLanguage';
  private readonly updateApi =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/UpdateLanguage';
  private readonly deleteApi =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/DeleteLanguage';

  constructor(private http: HttpClient) {}
  getLanguageInfo(query: LanguageQuery): Observable<LanguageResponse[]> {
    const params = new HttpParams().set('UserGuid', query.UserGuid);
    return this.http.get<LanguageInfoResponse>(this.getApiUrl, { params }).pipe(
      map((response) => {
        const payload = response.event;
        const data = payload.eventData?.[0]?.value;
        return Array.isArray(data) ? data : [];
      }),
      catchError((error) => {
        console.error('Error in getTrainingInfo:', error);
        return of([]);
      })
    );
  }

  insertLanguage(command: insertLanguage): Observable<any> {
    return this.http.post(this.insertApi, command).pipe(
      catchError((error) => {
        console.error('Error in insertTrainingInfo:', error);
        return throwError(() => error);
      })
    );
  }

  updateLanguage(command: updateLanguage): Observable<any> {
    return this.http.post(this.updateApi, command).pipe(
      catchError((error) => {
        console.error('Error in updateTrainingInfo:', error);
        return throwError(() => error);
      })
    );
  }

  deleteLanguage(command: deleteLanguage): Observable<any> {
    const params = new HttpParams()
      .set('L_ID', command.l_ID)
      .set('UserGuid', command.userGuid);
    return this.http.delete(this.deleteApi, {
      params,
    });
  }
}

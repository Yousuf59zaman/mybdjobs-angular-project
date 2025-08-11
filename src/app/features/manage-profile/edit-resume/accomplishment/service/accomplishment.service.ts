import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccomplishmentEventDataItem, AccomplishmentInfoQuery, AccomplishmentResponse, AccomplishmentUpdateInsert, DeleteAccomplishmentRequest, DeleteAccomplishmentResponse } from '../model/accomplishment';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccomplishmentService {
  private readonly getApiUrl = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetAccomplishmentInfo';
  private readonly insertApi = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/InsertOrUpdateAccomplishment';
 private readonly deleteAPI = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/DeleteAccomplishment';

  constructor(private http: HttpClient) { }

  getAccomplishmentInfo(query: AccomplishmentInfoQuery, type: number): Observable<AccomplishmentEventDataItem[]> {
    if (!query.UserGuid) {
      console.error('UserGuid is required');
      return of([]);
    }

    const params = new HttpParams().set('UserGuid', query.UserGuid);

    return this.http.get<AccomplishmentResponse>(this.getApiUrl, { params }).pipe(
      map(response => {
        if (!response?.event?.eventData?.[0]?.value) {
          return [];
        }
        const filteredData = response.event.eventData[0].value.filter(item => item.type === type);
        return filteredData;
      }),
      catchError(error => {
        return of([]);
      })
    );


  }

   insertUpdateInfo(command: AccomplishmentUpdateInsert): Observable<any> {
        return this.http.post(this.insertApi, command).pipe(
          catchError(error => {
            console.error('Error in insertTrainingInfo:', error);
            return throwError(() => error);
          })
        );
      }
      deleteInfo(request: DeleteAccomplishmentRequest): Observable<DeleteAccomplishmentResponse[]> {
        return this.http.post<DeleteAccomplishmentResponse[]>(this.deleteAPI, request).pipe(
          catchError(error => {
            console.error('Error in deleteInfo:', error);
            return throwError(() => error);
          })
        );
      }
}

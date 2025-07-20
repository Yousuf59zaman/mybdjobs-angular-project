import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiResponse, EmployerMessage } from '../models/employer-message';

@Injectable({
  providedIn: 'root'
})
export class EmployerMessageService {
  private apiUrl = 'https://mybdjobsorchestrator-odcx6humqq-as.a.run.app/api/EmployerActivities/GetMessageList';

  constructor(private http: HttpClient) { }

  getMessageList(userGuid: string): Observable<EmployerMessage[]> {
    const params = new HttpParams().set('UserGuid', userGuid);
    return this.http.get<ApiResponse>(this.apiUrl, { params }).pipe(
      map(response => {
        const messageData = response.event.eventData.find(data => data.key === 'message');
        return messageData ? messageData.value : [];
      }),
      catchError(error => {
        console.error('Error fetching message list:', error);
        return throwError(() => new Error('Something went wrong; please try again later.'));
      })
    );
  }
}

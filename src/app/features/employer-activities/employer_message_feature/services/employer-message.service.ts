import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiResponse, EmployerMessage, GetMessagesResponse } from '../models/employer-message';

@Injectable({
  providedIn: 'root'
})
export class EmployerMessageService {
  private apiUrl = 'https://mybdjobsorchestrator-odcx6humqq-as.a.run.app/api/EmployerActivities/GetMessageList';
  private messagesUrl = 'https://mybdjobsorchestrator-odcx6humqq-as.a.run.app/api/EmployerActivities/GetMessages';

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

  getMessages(params: {
    DeviceType: string;
    UserGuid: string;
    JobId: string;
    SenderType: string;
    ConversationId: number;
  }): Observable<GetMessagesResponse[]> {
    let httpParams = new HttpParams()
      .set('DeviceType', params.DeviceType)
      .set('UserGuid', params.UserGuid)
      .set('JobId', params.JobId)
      .set('SenderType', params.SenderType)
      .set('ConversationId', params.ConversationId.toString());

    return this.http.get<GetMessagesResponse[]>(this.messagesUrl, { params: httpParams }).pipe(
      catchError(error => {
        console.error('Error fetching messages:', error);
        return throwError(() => new Error('Something went wrong; please try again later.'));
      })
    );
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, GetUserEmailResponse } from '../interface/emailCV';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailCVService {
  private getApi = "https://localhost:7211/api/EmailCV/GetUserEmailId";
  constructor(private http: HttpClient) { }

  getUserEmails(userId: number): Observable<GetUserEmailResponse[]> {
    const params = new HttpParams().set('UserId', userId.toString());
    return this.http.get<ApiResponse>(this.getApi, { params }).pipe(
      map(response => {
        return response.eventData?.[0]?.value ?? [];
      })
    );
  }

  //sendEmails()


}

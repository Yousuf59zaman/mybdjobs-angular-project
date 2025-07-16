import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { 
  DeleteLinkPayload,
  InsertLinkPayload, 
  LinkInfoResponse, 
  LinkQuery, 
  LinkResponse,
  UpdateLinkPayload, 
} from '../../model/linkAccount';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinkAccountService {
  // You can switch between local and production URLs by uncommenting the appropriate lines
  // private readonly getApi = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetLinkAccounts';
  // private readonly insertApi = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/InsertAccountLink';
  // private readonly updateApi = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/UpdateLinkAccount';
  // private readonly deleteApi = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/DeleteLinkAccount';

  private readonly getApi = 'https://localhost:7211/api/EditResume/GetLinkAccounts';
  private readonly insertApi = 'https://localhost:7211/api/EditResume/InsertAccountLink';
  private readonly updateApi = 'https://localhost:7211/api/EditResume/UpdateLinkAccount';
  private readonly deleteApi = 'https://localhost:7211/api/EditResume/DeleteLinkAccount';

  constructor(private http: HttpClient) { }

  getLinkInfo(query: LinkQuery): Observable<LinkResponse[]> {
    const params = new HttpParams().set('UserGUID', query.UserGuid);
    return this.http.get<LinkInfoResponse>(this.getApi, { params }).pipe(
      map(response => {
        if (!response?.event?.eventData?.length) {
          console.warn('Unexpected API response structure', response);
          return [];
        }
        const dataItem = response.event.eventData.find(item => Array.isArray(item.value));
        if (!dataItem?.value) {
          return [];
        }
        return dataItem.value as LinkResponse[];
      }),
      catchError(error => {
        console.error('Error in getLinkInfo:', error);
        return of([]);
      })
    );
  }

  insertLinkInfo(payload: InsertLinkPayload): Observable<LinkResponse> {
    return this.http.post<LinkResponse>(this.insertApi, payload).pipe(
      catchError(error => {
        console.error('Error in insertLinkInfo:', error);
        throw error;
      })
    );
  }

  updateLinkInfo(payload: UpdateLinkPayload): Observable<LinkResponse> {
    return this.http.put<LinkResponse>(this.updateApi, payload).pipe(
      catchError(error => {
        console.error('Error in updateLinkInfo:', error);
        throw error;
      })
    );
  }

  deleteLinkInfo(payload: DeleteLinkPayload): Observable<LinkResponse> {
    const params = new HttpParams()
      .set('userGuid', payload.userGuid)
      .set('otherProfileId', payload.otherProfileId.toString());
    return this.http.delete<LinkResponse>(this.deleteApi, { params }).pipe(
      catchError(error => {
        console.error('Error in deleteLinkInfo:', error);
        throw error;
      })
    );
  }
}
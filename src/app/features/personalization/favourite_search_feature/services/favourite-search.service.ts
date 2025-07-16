import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable,map } from 'rxjs';
import { ApiResponse, ApiWrapper, AvailableJobsResponse, DeletePayload, FavouriteSearchResponse, QueryPayload, SubscribePayload } from '../models/favourite_search';

@Injectable({ providedIn: 'root' })
export class FavouriteSearchService {
  private readonly apiUrl = 'https://useractivitysubsystem-odcx6humqq-as.a.run.app/api/Personalization/GetFavouriteSearchList';
  private readonly availableJobsUrl = 'https://useractivitysubsystem-odcx6humqq-as.a.run.app/api/Personalization/GetAvaiableJobs';
  private readonly subscriptionUrl = 'https://useractivitysubsystem-odcx6humqq-as.a.run.app/api/Personalization/SMSSubscribe';
  private readonly deleteUrl = "https://useractivitysubsystem-odcx6humqq-as.a.run.app/api/Personalization/DeleteFavouriteSearch";


  constructor(private http: HttpClient) {}

  getFavourites(params: QueryPayload): Observable<ApiWrapper<FavouriteSearchResponse>> {
    let httpParams = new HttpParams()
      .set('UserGuid', params.GuidId.toString())
      .set('intCurPage', params.intCurPage.toString())
      .set('intNoOfRecordPerPage', params.intNoOfRecordPerPage.toString());
    if (params.strLastDate) {
      httpParams = httpParams.set('strLastDate', params.strLastDate);
    }
    return this.http.get<ApiWrapper<FavouriteSearchResponse>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }



  getAvailableJobs(GuidId: string, sfId: number): Observable<{ availableJobs: number }> {
    const httpParams = new HttpParams()
      .set('UserGuid', GuidId)
      .set('FId', sfId.toString());
  
    return this.http.get<AvailableJobsResponse>(this.availableJobsUrl, { params: httpParams, withCredentials: true }).pipe(
      map(response => {
        const messageData = response.event.eventData.find(ed => ed.key === 'GetAvailable_Job');
        const rawValue = messageData?.value ?? '0';
        
        return {
          availableJobs: parseInt(rawValue, 10) || 0
        };
      })

    );
  }

  updateSubcriptionValue(payload: SubscribePayload): Observable<any>
  {   
    return this.http.post(this.subscriptionUrl,payload,{
      withCredentials: true
    });
  }

  deleteFavourite(payload: DeletePayload): Observable<any> {
    return this.http.delete(this.deleteUrl, {
      body: payload,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    
    });
  }


}
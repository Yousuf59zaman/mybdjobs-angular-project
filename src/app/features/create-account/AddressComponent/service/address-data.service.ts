import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { District, LocationApiResponse, LocationResponse, PostLocation } from '../models/address';
import { TranslocoService } from '@jsverse/transloco';



@Injectable({
  providedIn: 'root'
})
export class AddressDataService {
  private apiUrl = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetLocation';
  private postUrl = 'https://accountsubsystem-odcx6humqq-as.a.run.app/api/CreateAccount/InsertAddress';
  constructor(
    private http: HttpClient,
    private translocoService: TranslocoService
  ) {}

  getDistricts(): Observable<District[]> {
    return this.http.get<LocationApiResponse>(this.apiUrl, {
      params: new HttpParams().set('lang', this.translocoService.getActiveLang().toUpperCase())
    }).pipe(
      map(response => response.event.eventData?.[0]?.value || [])
    );
  }


  getThanas(districtId: number): Observable<District[]> {
    return this.http.get<LocationApiResponse>(this.apiUrl, {
      params: new HttpParams().set('lang', this.translocoService.getActiveLang().toUpperCase()).set('districtId', districtId.toString())
    })
    .pipe(
      map(response => response.event.eventData?.[0].value || [])
    );
  }

  getPostOffices(districtId:number,thanaId: number): Observable<District[]> {
    return this.http.get<LocationApiResponse>(this.apiUrl, {
      params: new HttpParams().set('lang', this.translocoService.getActiveLang().toUpperCase()).set('districtId', districtId.toString()) .set('thanaId', thanaId.toString())
    })
    .pipe(
      map(response => response.event.eventData?.[0].value || [])
    );
  }

  submitAddress(addressData: PostLocation) {
    return this.http.post(this.postUrl, addressData);
  }
}

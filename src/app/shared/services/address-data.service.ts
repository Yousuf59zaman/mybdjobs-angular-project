import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { District, PostLocation,LocationResponse } from '../../features/create-account/AddressComponent/address/models/address';

@Injectable({
  providedIn: 'root'
})
export class AddressDataService {
  private apiUrl = 'https://localhost:7211/api/EditResume/GetLocation';
  private postUrl = "https://localhost:7097/api/CreateAccount/InsertAddress";

  constructor(private http: HttpClient) {}

  getDistricts(): Observable<District[]> {
    return this.http.get<LocationResponse>(this.apiUrl, {
      params: new HttpParams().set('lang', 'EN')
    }).pipe(
      map(response => response.eventData?.[0]?.value || [])
    );
  }
  

  getThanas(districtId: number): Observable<District[]> {
    return this.http.get<LocationResponse>(this.apiUrl, {
      params: new HttpParams().set('lang', 'EN').set('districtId', districtId.toString())    
    })
    .pipe(
      map(response => response.eventData?.[0].value || [])

    );
  }

  getPostOffices(districtId:number,thanaId: number): Observable<District[]> {
    return this.http.get<LocationResponse>(this.apiUrl, {
      params: new HttpParams().set('lang', 'EN').set('districtId', districtId.toString()) .set('thanaId', thanaId.toString())
    })
    .pipe(
      map(response => response.eventData?.[0].value || [])

    );
  }

  submitAddress(addressData: PostLocation) {
    return this.http.post(this.postUrl, addressData);
  }
}

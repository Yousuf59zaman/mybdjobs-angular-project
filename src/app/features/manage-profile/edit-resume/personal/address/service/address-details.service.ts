import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AddressDetails} from '../model/address-update.model';


@Injectable({
  providedIn: 'root'
})

export class AddressDetailsService { 
    addressDetailsApiUrl = "https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetAddress"
    locationApiUrl = "https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetLocation"
    countryApiUrl = "https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetCountryList"
    saveAddressApiUrl = "https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/UpdateAddressInfo"
   
    constructor(private http: HttpClient) {}

    getAddressDetails(UserGuid: string,Lang:string): Observable<any> {
        const params = new HttpParams()
        .set('UserGuid', UserGuid.toString())
        .set('Lang',Lang.toString());
        
        return this.http.get(this.addressDetailsApiUrl, { params,withCredentials:true });
    }

    getLocation(Lang: string,DistrictId:number,ThanaId:number): Observable<any> {
        const params = new HttpParams()
        .set('Lang', Lang.toString())
        .set('DistrictId',DistrictId.toString())
        .set('ThanaId',ThanaId.toString());
        
        return this.http.get(this.locationApiUrl, { params,withCredentials:true });
    }

    getCountry(Lang: string): Observable<any> {
        const params = new HttpParams()
        .set('Lang', Lang.toString());
        
        return this.http.get(this.countryApiUrl, { params,withCredentials:true });
    }

    saveAddress(addressDetails: AddressDetails): Observable<any> {
        return this.http.post(this.saveAddressApiUrl, addressDetails, { withCredentials:true });
    }



}

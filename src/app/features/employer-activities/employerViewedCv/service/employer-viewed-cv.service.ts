import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class EmployerViewedCvService { 
    empViewedCvApiUrl = "https://employersubsystem-odcx6humqq-as.a.run.app/api/EmployerActivity/GetEmployerViewedCvInfos"

    constructor(private http: HttpClient) {}

    getEmpViewedCvList(UserGuid: string,ItemsPerPage:number,PageNumber:number,FromDate:string,ToDate:string,CompName:string,TxtStatus:string): Observable<any> {
        const params = new HttpParams()
        .set('UserGuid', UserGuid.toString())
        .set('PageNumber',PageNumber.toString())
        .set('ItemsPerPage',ItemsPerPage.toString())
        .set('FromDate',FromDate.toString())
        .set('ToDate',ToDate.toString())
        .set('CompName',CompName.toString())
        .set('TxtStatus',TxtStatus.toString());
        
        return this.http.get(this.empViewedCvApiUrl, { params });
    }

  

}

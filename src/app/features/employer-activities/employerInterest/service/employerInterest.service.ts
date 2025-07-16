import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class EmployerInterestService { 
    empInterestApiUrl = "https://employersubsystem-odcx6humqq-as.a.run.app/api/EmployerActivity/GetEmployerInterestList"
    activityFlowApiUrl = "https://employersubsystem-odcx6humqq-as.a.run.app/api/EmployerActivity/ActivityFlowOfCompanyList"

    constructor(private http: HttpClient) {}

    getEmpInterestList(UserGuid: string,pageSize:number,pageNo:number): Observable<any> {
        const params = new HttpParams()
        .set('UserGuid', UserGuid.toString())
        .set('pageSize',pageSize.toString())
        .set('pageNo',pageNo.toString());
        
        return this.http.get(this.empInterestApiUrl, { params });
    }

    getActivityFlowOfCmp(UserGuid: string,CompanyId:number):Observable<any>{
      const params = new HttpParams()
        .set('UserGuid', UserGuid.toString())
        .set('CompanyId',CompanyId.toString());

        return this.http.get(this.activityFlowApiUrl, { params });
    }

}

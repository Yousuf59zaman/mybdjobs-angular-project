import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {EducationSavePayload} from '../models/educationSavePayload.model';
import { AutoSuggestionPayload } from '../models/autoSuggestionPayload.model';


@Injectable({
  providedIn: 'root'
})

export class EducationService { 
    //private readonly getUserEducationApiUrl = "https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetAcademicSummary"
    private readonly getUserEducationApiUrl = "https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetAcademicSummary"
    private readonly getEducationlevelApiUrl = "https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetUserEducation"
    private readonly saveEducationApiUrl = "https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/InsertAcademicSummary"
    private readonly deleteEducationApiUrl = "https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/DeleteAcademicSummary"
    private readonly updateEducationApiUrl = "https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/UpdateAcademicSummary"
    private readonly autoSuggestionApiUrl = "https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/AutoSuggestion"

    constructor(private http: HttpClient) {}

    getUserEducation(UserGuid: string): Observable<any> {
        const params = new HttpParams()
        .set('UserGuid', UserGuid.toString());
            
        return this.http.get(this.getUserEducationApiUrl, { params,withCredentials:true });
    }

    getEducation(strVersion: string, E_Code:number): Observable<any> {
        const params = new HttpParams()
        .set('strVersion', strVersion.toString())
        .set('E_Code', E_Code.toString());
            
        return this.http.get(this.getEducationlevelApiUrl, { params,withCredentials:true });
    }

    saveEducation(educationSavePayload  : EducationSavePayload): Observable<any> {         
        return this.http.post(this.saveEducationApiUrl, educationSavePayload, { withCredentials:true });
    }

    updateEducation(educationUpdatePayload  : EducationSavePayload): Observable<any> {         
        return this.http.post(this.updateEducationApiUrl, educationUpdatePayload, { withCredentials:true });
    }


    deleteEducation(userGuid:string,eduId: number): Observable<any> {
        const params = new HttpParams()
        .set('userGuid', userGuid.toString())
        .set('EducationId', eduId.toString());

        return this.http.delete(this.deleteEducationApiUrl, { params,withCredentials:true });
    }

    getEduAutoSuggestion(autoSuggestionPayload: AutoSuggestionPayload): Observable<any> {
        return this.http.post(this.autoSuggestionApiUrl, autoSuggestionPayload, { withCredentials:true });
    }


}
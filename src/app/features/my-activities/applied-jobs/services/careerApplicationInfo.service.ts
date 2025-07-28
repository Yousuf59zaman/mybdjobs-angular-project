import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import {
  CareerInfoResponse,
  CareerInfoResponseCookies,
  ExperienceApiResponse,
  GetCareerInfoQuery,
  JobBoosting,
  UpadteExistAppliedJob,
  UpdateCareerInfo,
} from '../models/appliedJobs.model'

@Injectable({
  providedIn: 'root',
})
export class CareerApplicationInfoServiceService {
  private apiUrl =
    'https://useractivitysubsystem-odcx6humqq-as.a.run.app/api/AppliedJob/GetApplyPositionInfo';
  private getApi =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetCareerInfo';
  private updateApi =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/UpdateCareerInfo';
  private boostApi =
    'https://useractivitysubsystem-odcx6humqq-as.a.run.app/api/AppliedJob/InsertBoostingData';
  private cancelApplyApi =
    'https://useractivitysubsystem-odcx6humqq-as.a.run.app/api/AppliedJob/CancelApply';
  private updateJobStatusApi =
    'https://useractivitysubsystem-odcx6humqq-as.a.run.app/api/AppliedJob/UpdateAppliedJobStatus';
  private cachedCompanies: string[] = [];
  private companiesLoaded = false;

  constructor(private http: HttpClient) {}

  getAppliedJobs(query: GetCareerInfoQuery) {
    let params = new HttpParams()
      .set('UserGuid', query.UserGuid)
      .set('Version', query.Version || 'EN');

    if (query.FromDate) params = params.set('FromDate', query.FromDate);
    if (query.ToDate) params = params.set('ToDate', query.ToDate);
    if (query.CompanyName)
      params = params.set('CompanyName', query.CompanyName);
    if (query.SelectValue)
      params = params.set('SelectValue', query.SelectValue);
    if (query.PageNumber)
      params = params.set('PageNumber', query.PageNumber.toString());
    if (query.LastDate)
      params = params.set('LastDate', query.LastDate.toString());
    if (query.NoOfRecordPerPage)
      params = params.set(
        'NoOfRecordPerPage',
        query.NoOfRecordPerPage.toString()
      );

    return this.http.get<CareerInfoResponse>(this.apiUrl, { params }).pipe(
      map((response) => {
        if (response?.event?.eventData?.[0]?.value?.data) {
          this.cachedCompanies = [
            ...new Set(
              response.event.eventData[0].value.data
                .map((job) => job.companyName)
                .filter((name) => name)
            ),
          ];
          this.companiesLoaded = true;
        }
        return response;
      }),
      shareReplay(1)
    );
  }

  getCompanySuggestions(term: string) {
    if (!this.companiesLoaded) {
      return of([]);
    }

    term = term.toLowerCase();
    const suggestions = this.cachedCompanies.filter((company) =>
      company.toLowerCase().includes(term)
    );
    return of(suggestions);
  }

  getCareerInfo(
    query: GetCareerInfoQuery
  ): Observable<CareerInfoResponseCookies> {
    const params = new HttpParams().set('UserGuid', query.UserGuid);
    return this.http.get<CareerInfoResponseCookies>(this.getApi, { params });
  }


  boostJob(boostJobDate: JobBoosting) {
    return this.http.post<void>(this.boostApi, boostJobDate);
  }

  cancelApplication(userGuid: string, jobId: string) {
    if (!userGuid || !jobId) {
      return throwError(() => new Error('UserGuid and JobId are required'));
    }

    const params = new HttpParams()
      .set('UserGuid', userGuid)
      .set('JobId', jobId);

    return this.http.delete(this.cancelApplyApi, { params }).pipe(
      catchError((error) => {
        console.error('Service error:', error);
        return throwError(error);
      })
    );
  }

  updateJobStatus(payload: any) {
    return this.http.put<any>(this.updateJobStatusApi, payload).pipe(
      catchError((error) => {
        console.error('Error updating job status:', error);
        return throwError(() => error);
      })
    );
  }

  updateJobStatusWithExperience(payload: UpadteExistAppliedJob) {
    return this.http
      .put<any>(
        'https://useractivitysubsystem-odcx6humqq-as.a.run.app/api/AppliedJob/UpdateAppliedJobStatus',
        payload
      )
      .pipe(
        catchError((error) => {
          console.error('Error updating job status with experience:', error);
          return throwError(error);
        })
      );
  }

  getExperienceList(userGuid: string) {
    return this.http.get<ExperienceApiResponse>(
      `https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetExperienceList?userGuid=${userGuid}`
    );
  }
}

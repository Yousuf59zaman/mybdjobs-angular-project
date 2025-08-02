import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DeleteResumeQuery, toHttpParams } from '../model/delete-resume';

@Injectable({ providedIn: 'root' })
export class DeleteResumeService {

    private static readonly DELETE_RESUME_API_URL = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/DeleteResume';
    constructor(private http: HttpClient) { }

    deleteResume(query: DeleteResumeQuery): Observable<any> {
        const params: HttpParams = toHttpParams(query);
        return this.http.post<any>(DeleteResumeService.DELETE_RESUME_API_URL, null, { params })
            .pipe(
                catchError(error => {
                    const errorMsg = 'Failed to delete resume. Please try again later.';
                    return throwError(() => new Error(errorMsg));
                })
            );
    }

}

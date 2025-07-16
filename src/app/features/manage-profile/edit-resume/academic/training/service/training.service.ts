import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  TrainingInfoQuery,
  TrainingSummary,
  TrainingInfoResponse,
  InsertTrainingInfoCommand,
  UpdateTrainingInfoCommand,
  DeleteTrainingInfo
} from '../model/training';


@Injectable({ providedIn: 'root' })
export class TrainingService {
  private readonly apiUrl = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetTrainingSummary';
  private readonly insertApi = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/InsertTrainingSummary';
  private readonly updateApi = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/UpdateTrainingSummary';
  private readonly deleteApi = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/DeleteTrainingSummary';

  constructor(private http: HttpClient) { }
  getTrainingInfo(query: TrainingInfoQuery): Observable<TrainingSummary[]> {
    const params = new HttpParams().set('UserGuid', query.UserGuid);
    return this.http.get<TrainingInfoResponse>(this.apiUrl, { params }).pipe(
      map(response => {
        const payload = response.event;
        const data = payload.eventData?.[0]?.value;
        return Array.isArray(data) ? data : [];
      }),
      catchError(error => {
        console.error('Error in getTrainingInfo:', error);
        return of([]);
      })
    );
  }


  insertTrainingInfo(command: InsertTrainingInfoCommand): Observable<any> {
    return this.http.post(this.insertApi, command).pipe(
      catchError(error => {
        console.error('Error in insertTrainingInfo:', error);
        return throwError(() => error);
      })
    );
  }


  updateTrainingInfo(command: UpdateTrainingInfoCommand): Observable<any> {
    return this.http.post(this.updateApi, command).pipe(
      catchError(error => {
        console.error('Error in updateTrainingInfo:', error);
        return throwError(() => error);
      })
    );
  }

  deleteTrainingInfo(command: DeleteTrainingInfo): Observable<any> {
    return this.http.delete(this.deleteApi, {
      body: command
    }).pipe(
      catchError(error => {
        console.error('Error in deleteTrainingInfo:', error);
        return throwError(() => error);
      })
    );
  }

}



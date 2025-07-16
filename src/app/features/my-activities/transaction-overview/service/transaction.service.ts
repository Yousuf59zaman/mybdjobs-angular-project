import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Transaction, TransactionRequest, TransactionResponse } from '../model/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly getApi = 'https://localhost:7198/api/TransactionList/getList';

  constructor(private http: HttpClient) { }

  getTransactionList(request: TransactionRequest): Observable<Transaction[]> {
    const params = new HttpParams()
      .set('fromDate', request.fromDate)
      .set('toDate', request.toDate)
      .set('featureStatus', request.featureStatus.toString())
      .set('UserGuid', request.UserGuid)
      .set('currentPage', request.currentPage.toString())
      .set('noOfRecordsPerPage', request.noOfRecordsPerPage.toString());

    return this.http.get<TransactionResponse>(this.getApi, { params }).pipe(
      map((response: TransactionResponse) => {
        if (response && response.event.eventData && response.event.eventData.length > 0) {
          return response.event.eventData[0].value;
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error fetching transactions:', error);
        return throwError(() => new Error('Failed to load transactions'));
      })
    );
  }
}
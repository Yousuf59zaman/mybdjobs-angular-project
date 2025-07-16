// birth-info.service.ts
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddDateOfBirthRequest } from '../model/add-date-of-birth-request.model';

@Injectable({ providedIn: 'root' })
export class BirthInfoService {
  private readonly apiUrl = 'https://accountsubsystem-52061700766.asia-southeast1.run.app/api/CreateAccount/AddDateOfBirth';

  constructor(private http: HttpClient) {}

  addDateOfBirth(request: AddDateOfBirthRequest): Observable<void> {
    // 1. Build HttpParams with PascalCase keys:
    console.log(request);
    
    let params = new HttpParams()
      .set('UserGuidId', request.UserGuidId.toString())
      // only set BirthDate if provided
      .set('BirthDate', request.BirthDate ?? '')
      .set('AgeNumber', (request.AgeNumber ?? 0).toString());
      return this.http.post<void>(
        this.apiUrl,
        null,
        { params }
      );
  }
}

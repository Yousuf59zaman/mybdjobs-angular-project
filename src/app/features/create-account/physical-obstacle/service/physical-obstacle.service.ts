import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PostForm } from '../model/physicalObstacle';

@Injectable({
  providedIn: 'root'  
})
export class PhysicalObstacleService {
  private postUrl = 'https://accountsubsystem-52061700766.asia-southeast1.run.app/api/CreateAccount/InsertDissbilityInformation';

  constructor(private http: HttpClient) {}
  submitPhysicalForm(physicalObstacleData: PostForm): Observable<ApiResponse[]> {
    return this.http.post<ApiResponse[]>(this.postUrl, physicalObstacleData);
  }
}

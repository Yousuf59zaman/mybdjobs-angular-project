// // import { Injectable } from '@angular/core';
// // import { Pointreward, PointRewardQuery } from '../interface/pointReward';
// // import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
// // import { HttpClient, HttpParams } from '@angular/common/http';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class PointRewardService {
// //   private apiUrl = 'https://localhost:7198/api/PointsRewards/GetPointlist';
// //   loading$ = new BehaviorSubject<boolean>(false);
// //   userPointList$ = new BehaviorSubject<Pointreward[]>([]);
// //   filterPointList$ = new BehaviorSubject<Pointreward[]>([]);

// //   constructor(private http: HttpClient) {}

// //   // Fetch point list based on query parameters
// //   getPointList(query: PointRewardQuery): Observable<Pointreward[]> {
// //     const params = this.buildHttpParams(query);

// //     this.loading$.next(true); // Set loading state to true

// //     return this.http.get<Pointreward[]>(this.apiUrl, { params }).pipe(
// //       tap((points: Pointreward[]) => {
// //         console.log('Points fetched from API:', points); // Log fetched points
// //         this.filterPointList$.next(points);
// //         this.userPointList$.next(points);
// //       }),
// //       finalize(() => {
// //         this.loading$.next(false);
// //       })
// //     );
// //   }

// //   private buildHttpParams(query: PointRewardQuery): HttpParams {
// //     let params = new HttpParams();
// //     const formatDate = (date: string | null) => date || '';

// //     if (query.UserID) {
// //       params = params.set('UserID', query.UserID.toString());
// //     }
// //     if (query.fmDate) {
// //       params = params.set('fmDate', formatDate(query.fmDate));
// //     }
// //     if (query.toDate) {
// //       params = params.set('toDate', formatDate(query.toDate));
// //     }
// //     if (query.pointType) {
// //       params = params.set('pointType', query.pointType);
// //     }
// //     if (query.pageNo) {
// //       params = params.set('pageNo', query.pageNo);
// //     }
// //     if (query.pageSize) {
// //       params = params.set('pageSize', query.pageSize);
// //     }

// //     return params;
// //   }
// // }



// // src/app/services/points.service.ts

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { PointsSearchQuery, GetPointsListResponse } from '../interface/pointReward';

// @Injectable({
//   providedIn: 'root'
// })
// export class PointsService {
//   private readonly apiUrl ='https://localhost:7198/api/PointsRewards/GetPointlist';  // adjust to your actual base URL

//   constructor(private http: HttpClient) {}
//   getPointsList(query: PointsSearchQuery): Observable<{ results: GetPointsListResponse[]; totalItems: number; totalPoint: string; }> {
//     // Build query params
//     let params = new HttpParams()
//       .set('UserGuid', query.UserGuid)
//       .set('PageNo', query.PageNo.toString())
//       .set('PageSize', query.PageSize.toString());

//     if (query.FromDate)   { params = params.set('FromDate', query.FromDate); }
//     if (query.ToDate)     { params = params.set('ToDate', query.ToDate); }
//     if (query.PointType)  { params = params.set('PointType', query.PointType); }

//     return this.http.get<{ results: GetPointsListResponse[]; totalItems: number; totalPoint: string }>(
//       `${this.apiUrl}/search`,
//       { params }
//     );
//   }
// }


// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable, map } from 'rxjs';
// import { PointsSearchQuery, GetPointsListResponse } from '../interface/pointReward';

// @Injectable({
//   providedIn: 'root'
// })
// export class PointsService {
//   private apiUrl = 'https://localhost:7198/api/PointsRewards';

//   constructor(private http: HttpClient) { }

//   getPointsList(query: PointsSearchQuery): Observable<{ results: GetPointsListResponse[]; totalItems: number; totalPoint: string; }> {
//     let params = new HttpParams()
//       .set('UserGuid', query.UserGuid)
//       .set('PageNo', query.PageNo.toString())
//       .set('PageSize', query.PageSize.toString());

//     if (query.FromDate) params = params.set('FromDate', query.FromDate);
//     if (query.ToDate) params = params.set('ToDate', query.ToDate);
//     if (query.PointType) params = params.set('PointType', query.PointType.toString());

//     return this.http.get<any>(`${this.apiUrl}/GetPointlist`, { params }).pipe(
//       map(response => {
//         // Assuming the API returns data in eventData structure
//         const data = response.eventData?.[0]?.value || [];
//         return {
//           results: data,
//           totalItems: response.totalItems || 0,
//           totalPoint: response.totalPoint || '0'
//         };
//       })
//     );
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PointsSearchQuery, PointsApiResponse } from '../interface/pointReward';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private apiUrl ='https://useractivitysubsystem-odcx6humqq-as.a.run.app/api/PointsRewards';

  constructor(private http: HttpClient) { }

  getPointsList(query: PointsSearchQuery): Observable<PointsApiResponse> {
    let params = new HttpParams()
      .set('UserGuid', query.UserGuid)
      .set('PageNo', query.PageNo.toString())
      .set('PageSize', query.PageSize.toString());

    if (query.FromDate) params = params.set('FromDate', query.FromDate);
    if (query.ToDate) params = params.set('ToDate', query.ToDate);
    if (query.PointType) params = params.set('PointType', query.PointType);

    return this.http.get<PointsApiResponse>(`${this.apiUrl}/GetPointlist`, { params, withCredentials: true });
  }
}
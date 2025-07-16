import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CookieService } from '../cookie/cookie.service';
import { AuthService } from '../auth/auth.service';
import { Cookies, Domain } from '../../../shared/enums/app.enums';

@Injectable()
export class HTTPInterceptor implements HttpInterceptor {

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private auth: AuthService
  ) { }
  // headers: new HttpHeaders({
  //   'Content-Type': 'application/x-www-form-urlencoded',
  // }),
  // withCredentials: true,
  // params: params
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.cookieService.getCookie(Cookies.AUTH);
    if (request.url.endsWith(AspApiEndpoint)) {
      request = request.clone({
        withCredentials: true,
        setHeaders: {
          'Content-Type': `application/x-www-form-urlencoded`,
        },
        params: request.params.set('domain', Domain),
      });
    }
    // if (accessToken) {
    //   request = request.clone({
    //     withCredentials: true,
    //     setHeaders: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   });
    // } else {
    //   request = request.clone({
    //     withCredentials: true
    //   });
    // }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err, request, next))
    );
  }

  private handleError(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler) {
    if (error.status === 401) {
      return this.refreshToken(request, next);
    }

    return throwError(() => error);
  }

  private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = this.cookieService.getCookie(Cookies.REFTOKEN);

    if (!refreshToken) {
      return throwError(() => this.auth.redirectToMybdjobsApp());
    }

    const refreshTokenUrl = 'refresh-token-api-endpoint';
    const refreshTokenBody = { refreshToken };

    return this.http
      .post<any>(refreshTokenUrl, refreshTokenBody)
      .pipe(
        map((response) => {
          const newAccessToken = response.accessToken;
          const newRefreshToken = response.refreshToken;
          this.cookieService.setCookie(Cookies.AUTH, newAccessToken, 5);
          this.cookieService.setCookie(Cookies.REFTOKEN, newRefreshToken, 5);
          return request.clone({
            setHeaders: { Authorization: `Bearer ${newAccessToken}` }
          });
        }),
        catchError((error) => {
          return throwError(() => this.auth.redirectToMybdjobsApp());
        })
      )
      .pipe(
        mergeMap((updatedRequest) => next.handle(updatedRequest))
      );
  }
}

export const AspApiEndpoint = '.asp';
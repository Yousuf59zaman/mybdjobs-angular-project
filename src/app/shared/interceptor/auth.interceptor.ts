// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip for auth requests or if no token
    if (request.url.includes('/api/Login/') || !this.authService.getAuthToken()) {
      return next.handle(request);
    }

    // Clone request and add auth header
    const authReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getAuthToken()}`
      }
    });

    return next.handle(authReq);
  }
}
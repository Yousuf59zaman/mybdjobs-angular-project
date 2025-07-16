import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { environment } from '../../../environments/environment';
// import { environmentDevelopmentenvironment } from '../../../environments/environment.development';
// import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService) { }

  canActivate(): boolean {
    return this.checkAuth();
  }

  canActivateChild(): boolean {
    return this.checkAuth();
  }

  private checkAuth(): boolean {
    if (!environment.production) {
      return true;
    }

    if (this.authService.isAuthenticatedUser()) {
      // return true;
      if (environment.production) {
        this.authService.redirectToMybdjobsApp();
      }
      return false;
    }
    return true;
  }

}
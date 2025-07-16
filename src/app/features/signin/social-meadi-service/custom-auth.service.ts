import { Injectable } from '@angular/core';
import { AuthGoogleService } from '../social-meadi-service/auth-google.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
    providedIn: 'root'
})
export class CustomAuthService extends OAuthService {

    // constructor() { }
    public getLoginUrl(): Promise<string> {
        return this.createLoginUrl();
    }
}
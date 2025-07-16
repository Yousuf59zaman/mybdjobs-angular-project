import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../auth.config';
import { CustomAuthService } from './custom-auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, AuthApiResponse } from '../models/login.model';

@Injectable({
    providedIn: 'root',
})
export class AuthGoogleService {
    private oAuthService = inject(CustomAuthService);
    // private customService = inject(CustomAuthService)
    private router = inject(Router);
    profile = signal<any>(null);

    // constructor() {
    //     this.initConfiguration();
    //     // window.addEventListener('message', this.listener);
    // }

    // initConfiguration() {
    //     this.oAuthService.configure(authConfig);
    //     this.oAuthService.setupAutomaticSilentRefresh();
    //     this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
    //         if (this.oAuthService.hasValidIdToken()) {
    //             const claims = this.oAuthService.getIdentityClaims();
    //             console.log('User claims:', claims);
    //             localStorage.setItem('claim', claims.toString());
    //             const idToken = this.oAuthService.getIdToken();
    //             const accessToken = this.oAuthService.getAccessToken();
    //             localStorage.setItem('idToken', idToken);
    //             localStorage.setItem('accessToken', accessToken);
    //             console.log('ID Token:', idToken);
    //             console.log('Access Token:', accessToken);
    //             this.profile.set(this.oAuthService.getIdentityClaims());
    //         }
    //     });
    // }
    constructor() {
        this.oAuthService.configure(authConfig);

        // Only runs when this page is opened (either directly or from popup)
        this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
            console.log('[Auth] Attempted login code flow.');
            if (this.oAuthService.hasValidAccessToken()) {
                console.log('[Auth] has token.');
                const idToken = this.oAuthService.getIdToken();
                const accessToken = this.oAuthService.getAccessToken();
                const claims = this.oAuthService.getIdentityClaims();

                console.log('[Auth] ✅ Login successful.');
                console.log('[Auth] ID Token:', idToken);
                console.log('[Auth] Access Token:', accessToken);
                console.log('[Auth] Claims:', claims);

                // Send back to parent if in popup
                if (window.opener) {
                    console.log('[Auth] Sending tokens to main window via postMessage...');
                    window.opener.postMessage({
                        type: 'google-auth-success',
                        idToken,
                        accessToken,
                        claims
                    }, window.location.origin);
                    console.log('[Auth] Closing popup...');
                    window.close(); // ✅ Close popup after sending
                } else {
                    // Fallback: you are in main tab
                    localStorage.setItem('idToken', idToken);
                    localStorage.setItem('accessToken', accessToken);
                    this.profile.set(claims);
                    this.verifyGoogleToken(idToken);
                    console.warn('[Auth] No valid access token found. Login failed or was cancelled.');
                }
            }
        });

        // Listener for main window to receive tokens
        window.addEventListener('message', this.listener);
    }




    login() {
        console.log('[Auth] Opening Google login popup...');
        const loginUrl = `${authConfig.issuer}/o/oauth2/v2/auth` +
            `?client_id=${authConfig.clientId}` +
            `&redirect_uri=${encodeURIComponent(authConfig.redirectUri!)}` +
            `&response_type=${authConfig.responseType}` +
            `&scope=${encodeURIComponent(authConfig.scope!)}` +
            `&state=${this.generateStateToken()}` +
            `&prompt=select_account` +
            `&access_type=offline`;



        window.open(loginUrl, '_blank', 'width=500,height=600');

    }

    // Generate state token (security best practice)
    generateStateToken() {
        return crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
    }


    logout() {
        this.oAuthService.revokeTokenAndLogout();
        this.oAuthService.logOut();
        this.profile.set(null);
    }

    getProfile() {
        return this.profile();
    }

    private listener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type === 'google-auth-success') {
            localStorage.setItem('idToken', event.data.idToken);
            localStorage.setItem('accessToken', event.data.accessToken);
            this.profile.set(event.data.claims);
            console.log('[Auth] 🔄 Received tokens from popup.');
            console.log('[Auth] Access Token:', event.data.accessToken);
            console.log('[Auth] ID Token:', event.data.idToken);
        }
    };

    // listener = (event: MessageEvent) => {
    //     if (event.origin !== window.location.origin) return;
    //     if (event.data?.type === 'google-auth-success') {
    //         const idToken = event.data.idToken;
    //         console.log("id Token", idToken)
    //         const accessToken = event.data.accessToken;
    //         console.log("acc Token", accessToken)
    //         console.log('✅ ID Token:', idToken);
    //         console.log('✅ Access Token:', accessToken);

    //         // Set tokens in OAuthService
    //         this.oAuthService.initImplicitFlowInternal();
    //         this.oAuthService.processIdToken(idToken, accessToken);

    //         this.profile.set(this.oAuthService.getIdentityClaims());

    //         // Send to backend if needed
    //         // this.sendTokenToBackend(idToken);

    //         window.removeEventListener('message', this.listener);
    //     }
    // };

    verifyGoogleToken(idToken: string): void {
        const http = inject(HttpClient);
        const apiUrl = 'https://your-api.com/auth'; // <-- Replace with your actual endpoint

        http.post<{ event: ApiResponse<AuthApiResponse> }>(
            apiUrl,
            { idToken }, // send as body with `idToken` key
            { withCredentials: true }
        ).subscribe({
            next: (res) => {
                const eventType = res.event.eventType;
                console.log(eventType === 2 ? false : true);
            },
            error: (err) => {
                console.error('[Auth] ❌ Token verification failed', err);
                console.log(false);
            }
        });
    }

}

// google-auth.service.ts
import { Injectable } from '@angular/core';
declare const google: any;
@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
    private authWindow: Window | null = null;

    initGoogleAuth(clientId: string, callback: (response: any) => void): void {
        if (typeof google === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.onload = () => {
                google!.accounts.id.initialize({
                    client_id: '656340698751-kt8lk3hujr2grfo7rnjmddb85rmg1c2q.apps.googleusercontent.com',
                    callback,
                    ux_mode: 'popup'
                });
            };
            document.head.appendChild(script);
        } else {
            google.accounts.id.initialize({
                client_id: '656340698751-kt8lk3hujr2grfo7rnjmddb85rmg1c2q.apps.googleusercontent.com',
                callback,
                ux_mode: 'popup'
            });
        }
    }

    openGoogleSignIn(): void {
        const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        url.searchParams.set('client_id', '656340698751-kt8lk3hujr2grfo7rnjmddb85rmg1c2q.apps.googleusercontent.com');
        url.searchParams.set('redirect_uri', 'https://gateway.bdjobs.com/jobseeker-panel/signin');
        url.searchParams.set('response_type', 'id_token');
        url.searchParams.set('scope', 'openid email profile');
        url.searchParams.set('display', 'popup');
        url.searchParams.set('prompt', 'select_account');
        url.searchParams.set('flowName', 'GeneralOAuthFlow');

        // Open in new tab instead of popup
        this.authWindow = window.open(url.toString(), '_blank', 'width=500,height=600');

        // Listen for messages from the popup
        window.addEventListener('message', this.handleMessage.bind(this));
    }

    private handleMessage(event: MessageEvent) {
        if (event.origin !== 'https://accounts.google.com') return;

        if (event.data.type === 'auth_result') {

            const token = event.data.credential;

            if (this.authWindow) this.authWindow.close();

        }
    }
}
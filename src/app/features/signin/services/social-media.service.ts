import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare const google: any;
interface PromptMomentNotification {
    isNotDisplayed(): boolean;
    isSkippedMoment(): boolean;
    getNotDisplayedReason(): string;
    // Add other members if needed
}

@Injectable({ providedIn: 'root' })
export class SocialMediaService {
    private http = inject(HttpClient);
    private initialized = false;

    private initializeGoogle() {
        if (this.initialized) return;
        google.accounts.id.initialize({
            client_id: '656340698751-kt8lk3hujr2grfo7rnjmddb85rmg1c2q.apps.googleusercontent.com',
            callback: this.sendToBackend.bind(this),
            ux_mode: 'popup',
            prompt_parent_id: 'google-button-container',
            auto_select: false
        });
        this.initialized = true;
    }

    signIn() {
        this.initializeGoogle();

        // google.accounts.id.prompt((notification: PromptMomentNotification) => {
        //     if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        //         console.warn('FedCM blocked or skipped:', notification.getNotDisplayedReason());
        //     }
        // });
        google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed()) {
                const reason = notification.getNotDisplayedReason?.();
                console.warn('FedCM not displayed:', reason);

                // Optional: fallback logic
                google.accounts.id.cancel(); // cancel any active sessions
                this.showOneTapOrManualPopup();
            } else if (notification.isSkippedMoment()) {
                console.warn('FedCM skipped by browser or user');
                this.showOneTapOrManualPopup();
            } else {
                console.log('FedCM prompt displayed successfully');
            }
        });
    }

    private sendToBackend(response: any) {
        const token = response.credential;
        console.log("Google token", token)

        this.http.post('/api/auth/google', { token }).subscribe({
            next: res => console.log('Login success:', res),
            error: err => console.error('Login failed:', err)
        });
    }

    private showOneTapOrManualPopup() {
        google.accounts.id.prompt(); // retry
        // OR trigger popup manually if necessary
        // google.accounts.id.renderButton(...) if you're using one-tap
    }
}

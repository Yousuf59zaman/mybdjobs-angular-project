import { computed, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { CookieService } from '../cookie/cookie.service';
import { isPlatformBrowser } from '@angular/common';
import { Cookies, mybdjobsWelcome, RecruiterPanelUrl } from '../../../shared/enums/app.enums';
import { redirectExternal } from '../../../shared/utils/functions';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isBrowser: boolean;
    private isAuthenticated = signal<boolean>(false);
    public isAuthenticatedUser = computed(() => this.isAuthenticated());

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private cookieService: CookieService) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        if (this.cookieService.getCookie("MybdjobsGId")) {
            this.isAuthenticated.set(true);
        }
    }

    redirectToMybdjobsApp() {
        if (this.isBrowser) {
            redirectExternal(mybdjobsWelcome)
        }
    }

}
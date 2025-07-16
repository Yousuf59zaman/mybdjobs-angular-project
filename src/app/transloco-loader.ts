import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
// import { environment } from '../environments/environment';
import { environmentDevelopment } from '../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    private http = inject(HttpClient);

    getTranslation(lang: string) {
        // return this.http.get<Translation>(`${environment.i18nBaseUrl}/${lang}.json`);  // Uncomment this line for production
        return this.http.get<Translation>(`${environmentDevelopment.i18nBaseUrl}/${lang}.json`);  // Use this line for development
    }

}


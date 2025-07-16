import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private selectedLang = new BehaviorSubject<'en' | 'bn'>('bn');
  selectedLang$ = this.selectedLang.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateLanguageFromUrl());

    this.updateLanguageFromUrl();
  }

  private updateLanguageFromUrl() {
    const isBangla = this.router.url.startsWith('/bn');
    this.selectedLang.next(isBangla ? 'bn' : 'en');
  }

  switchLanguage(lang: 'en' | 'bn') {
    let newUrl = this.router.url;

    if (lang === 'en' && newUrl.startsWith('/bn')) {
      newUrl = newUrl.replace(/^\/bn/, '') || '/';
    } else if (lang === 'bn' && !newUrl.startsWith('/bn')) {
      newUrl = '/bn' + newUrl;
    }

    if (newUrl !== this.router.url) {
      this.router.navigateByUrl(newUrl);
    }
  }
}

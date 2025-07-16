import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-sign-up',
  imports: [TranslocoModule,],
  providers: [provideTranslocoScope('signin')],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  private destroyRef = inject(DestroyRef);
  private translocoService = inject(TranslocoService);
  currentLang = signal(this.translocoService.getActiveLang());
  langChanges$ = this.translocoService.langChanges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(lang => { 
        this.currentLang.set(lang);
  });
}

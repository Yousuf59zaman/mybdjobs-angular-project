import { Component, DestroyRef, inject, signal } from '@angular/core';
import { SharedService } from '../../services/share.service';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-access-account',
  imports: [TranslocoModule],
  providers: [provideTranslocoScope('signin')],
  templateUrl: './access-account.component.html',
  styleUrl: './access-account.component.scss'
})
export class AccessAccountComponent {
   protected shareService = inject(SharedService)
   readonly currentPanel = this.shareService.currentPanel;
   private destroyRef = inject(DestroyRef);
   private translocoService = inject(TranslocoService);

   currentLang = signal(this.translocoService.getActiveLang());
      langChanges$ = this.translocoService.langChanges$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(lang => { 
        this.currentLang.set(lang);
  });
}

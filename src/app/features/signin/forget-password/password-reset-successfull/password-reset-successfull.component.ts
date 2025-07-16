import { Component, DestroyRef, inject, signal } from '@angular/core';
import { SharedService } from '../../services/share.service';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-password-reset-successfull',
  imports: [TranslocoModule],
  providers: [provideTranslocoScope('signin')],
  templateUrl: './password-reset-successfull.component.html',
  styleUrl: './password-reset-successfull.component.scss'
})
export class PasswordResetSuccessfullComponent {
   protected sharedService = inject(SharedService)

   private destroyRef = inject(DestroyRef);
   private translocoService = inject(TranslocoService);
   
    currentLang = signal(this.translocoService.getActiveLang());
      langChanges$ = this.translocoService.langChanges$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(lang => { 
        this.currentLang.set(lang);
     });
}

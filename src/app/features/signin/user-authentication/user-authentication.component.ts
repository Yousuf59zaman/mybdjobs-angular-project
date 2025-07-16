import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { SharedService } from '../services/share.service';
import { LogInComponent } from '../log-in/log-in.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { NgClass, NgComponentOutlet } from '@angular/common';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-authentication',
  imports: [NgClass,NgComponentOutlet,TranslocoModule],
  providers: [provideTranslocoScope('signin')],
  templateUrl: './user-authentication.component.html',
  styleUrl: './user-authentication.component.scss'
})
export class UserAuthenticationComponent {
  private destroyRef = inject(DestroyRef);
  private sharedService = inject(SharedService)
  private translocoService = inject(TranslocoService);
  currentLang = signal(this.translocoService.getActiveLang());
  langChanges$ = this.translocoService.langChanges$
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe(lang => { 
    this.currentLang.set(lang);
  });

  tabs = [
    { name: 'SignIn', component: LogInComponent},
    { name: 'SignUp', component: SignUpComponent  },

  ];
  activeTab = signal(this.tabs[0]); 

  constructor() {
    effect(() => {
      const selected = this.sharedService.selectedTab();
      const match = this.tabs.find(tab => tab.name === selected);
      if (match) this.activeTab.set(match);
    });
  }

  setTab(tab: { name: string; component: any }) {
    this.activeTab.set(tab);
    this.sharedService.setTab(tab.name); // 🔁 sync back to the service
  }
}

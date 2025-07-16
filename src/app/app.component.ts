import { Component, DestroyRef, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ScriptLoaderService } from './core/services/script-loader/script-loader.service';
// import { IStaticMethods } from 'preline/preline';
import { delay, filter, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { LayoutComponent } from './core/layouts/layout/layout.component';
import { EducationComponent } from './features/create-account/EducationComponent/education/education.component';
import { LayoutHomeComponent } from "./core/layouts/layout-home/layout-home.component";
import { NgIf } from '@angular/common';


// declare global {
//   interface Window {
//     HSStaticMethods: IStaticMethods;
//   }
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

  imports: [LayoutComponent, LayoutHomeComponent, NgIf],
})
export class AppComponent {
  title = 'mybdjobs-angular-project';
  formControlTest = new FormControl(false);
  isSignInRoute = false;

  private scriptLoader = inject(ScriptLoaderService);
  private destroyRef = inject(DestroyRef);
  private subscription = inject(Router)

    .events.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter((event) => event instanceof NavigationEnd),
      delay(100),
      // finalize(() => window.HSStaticMethods.autoInit())
    ).subscribe();

  private router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isSignInRoute = this.router.url.includes('signin');
    });
  }

  async ngOnInit() {
    typeof window !== 'undefined' &&
      (await this.scriptLoader.loadScript('assets/js/preline.js'));
    // window.HSStaticMethods.autoInit();

  }

}

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslocoDirective],
  providers:[provideTranslocoScope('footer')],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  IsCorporateUser = signal(false)
  ngOnInit() {
    // const value = localStorage.getItem(IsCorporateUser);
    // this.IsCorporateUser.set(value === 'true');
  }
}

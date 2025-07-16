import { Component } from '@angular/core';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-account-delete',
  imports: [TranslocoModule],
  templateUrl: './account-delete.component.html',
  styleUrl: './account-delete.component.scss',
  providers : [provideTranslocoScope("accountDelete")]
})
export class AccountDeleteComponent {

}

import { Component } from '@angular/core';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-account-setting',
  imports: [TranslocoModule],
  templateUrl: './account-setting.component.html',
  styleUrl: './account-setting.component.scss',
  providers: [provideTranslocoScope('accountSetting')]
})
export class AccountSettingComponent {

}

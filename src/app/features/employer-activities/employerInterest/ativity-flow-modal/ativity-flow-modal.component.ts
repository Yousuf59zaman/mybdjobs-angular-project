import { Component, inject, Input } from '@angular/core';
import { JobActivity } from '../model/activityFlow.model';
import { provideTranslocoScope, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { convertToBanglaDigits,formatDate } from '../../../common/utility';

@Component({
  selector: 'app-ativity-flow-modal',
  imports: [TranslocoDirective],
  providers:[provideTranslocoScope('employerInterest')],
  templateUrl: './ativity-flow-modal.component.html',
  styleUrl: './ativity-flow-modal.component.scss'
})
export class AtivityFlowModalComponent {
  
  @Input() cmpName: string = '';
  @Input() totalJob: number = 0;
  @Input() jobActivityData: JobActivity[] =[];
  formatDate = formatDate;
  convertToBanglaDigits  = convertToBanglaDigits;
  private translocoService  = inject(TranslocoService);
  currentLanguage  :string = '';

  constructor() {
    this.translocoService.langChanges$.subscribe((lang) => {
      this.currentLanguage = lang;
    });
  }



}

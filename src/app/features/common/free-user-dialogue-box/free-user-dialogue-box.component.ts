import { Component, Input } from '@angular/core';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';


@Component({
  selector: 'app-free-user-dialogue-box',
  imports: [TranslocoDirective],
  providers:[provideTranslocoScope('employerInterest')],
  templateUrl: './free-user-dialogue-box.component.html',
  styleUrl: './free-user-dialogue-box.component.scss'
})
export class FreeUserDialogueBoxComponent {
  @Input() totalCvView:string = '';
  @Input() title:string ='';
  @Input() subTitle:string ='';
  @Input() iconName:string ='';
}

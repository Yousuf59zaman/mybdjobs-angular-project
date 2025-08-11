import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';


@Component({
  selector: 'accordion-main-body',
  imports: [
    NgClass, TranslocoModule
  ],
  templateUrl: './accordion-main-body.component.html',
  providers: [provideTranslocoScope('editResumeOtherRelevant')],
  // styleUrl: './accordion-main-body.component.scss'
})
export class AccordionMainBodyComponent {
  accordionName = input('');
  buttonType = input(''); // 'edit' | 'add'
  buttonTitle = input('Edit');
  isAccordionOpen = input(false);
  isFormOpen = input(false);
  maxCount = input(0);
  @Input() isAddButtonDisabled: boolean = false;

 

  @Output() formToggleEmitter = new EventEmitter<boolean>();
  @Output() accordionToggleEmitter = new EventEmitter<boolean>();

  onClickHeaderBtn() {
    this.formToggleEmitter.emit(true);
  }
}

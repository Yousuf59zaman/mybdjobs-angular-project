import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-no-details-training-summary',
  imports: [],
  templateUrl: './no-details-training-summary.component.html',
  styleUrl: './no-details-training-summary.component.scss'
})
export class NoDetailsSummaryComponent {
    readonly description = input<string>(' ')
    readonly btnText = input<string>('')
    @Output() openFormBtn = new EventEmitter<void>()
  

    handleClick() {
      this.openFormBtn.emit();
    }
  

}

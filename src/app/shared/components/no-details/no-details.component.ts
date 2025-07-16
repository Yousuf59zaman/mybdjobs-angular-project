import { Component, EventEmitter, Input, input, Output } from '@angular/core';

@Component({
  selector: 'app-no-details',
  imports: [],
  templateUrl: './no-details.component.html',
  styleUrl: './no-details.component.scss'
})
export class NoDetailsComponent {
  readonly description = input<string>(' If you are a retired army person then you can give that information by clicking on the following button.')
  readonly btnText = input<string>('Add Experience at Bangladesh Army')
  @Output() openFormBtn = new EventEmitter<void>()

  // @Input({ required: true }) openForm!: () => void;
  handleClick() {
    this.openFormBtn.emit();
  }

 
}

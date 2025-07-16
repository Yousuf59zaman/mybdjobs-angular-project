import { ChangeDetectionStrategy, Component, EventEmitter, Input, input, model, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectRadioData } from '../../models/models';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RadioComponent implements OnChanges{
  readonly isRequired = input<boolean>(false);
  readonly isDisabled = input<boolean>(false);
  control = model(new FormControl());
  radioItems = input<SelectRadioData[]>([]);
  isHtmlLabel = input<boolean>(false);
  isHorizontalOption = input<boolean>(true);
  // Output to emit the radio value change event
  @Output() selectionChange = new EventEmitter<any>();

   // generate unique IDs for label and id matching
   generateId(item: SelectRadioData): string {
    return `${item.name}-${item.id}`;
  }

  constructor() {
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control'] && this.control()) {
      this.control().valueChanges.subscribe((res) => {
        console.log('Radio emitted value:', res);
        this.selectionChange.emit(res);
      });
    }
  }

  
}
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputType } from '../input/input.component';
import { SelectItem } from '../../models/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SelectComponent {
  readonly placeholder = input('');
  readonly label = input<string>('');
  readonly type = input<InputType>('text');
  readonly isRequired = input<boolean>(false);
  readonly isDisabled = input<boolean>(false);
  readonly name = input('');
  readonly control = input<FormControl>(new FormControl());
  readonly falseOption = input<boolean>(true);
  readonly options = input<SelectItem[]>([]);
  readonly falseOptionText = input('Please select an option')

  
}
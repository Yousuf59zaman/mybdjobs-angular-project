import { AfterViewInit, ChangeDetectionStrategy, Component, Input, input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { reinitializePreline } from '../../utils/reinitializePreline';
import { NgClass } from '@angular/common';
import { NumericOnlyDirective } from '../../../core/directives/numeric-only.dir';

export type InputType = 'text' | 'password' | 'email' | 'number';

enum InputStype  {
  error = 'hs-validation-name-error',
  success = 'hs-validation-name-success',
  normal = ''
};

enum InputTypeStype {
  // normal = 'block w-full rounded-md border-gray-400 py-1.5 pl-5 pr-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
  // error = 'py-3 px-4 block w-full border-red-500 rounded-lg text-sm focus:border-red-500 focus:ring-red-500 ',
  // success = 'py-3 px-4 block w-full border-teal-500 rounded-lg text-sm focus:border-teal-500 focus:ring-teal-500'

  normal = 'h-[38px] block w-full rounded-lg border border-[#D0D5DD] py-1.5 pl-3 pr-6 text-primary-700 placeholder:text-gray-400 focus:ring-0 focus:border-2 focus:border-[#D95BB0] text-sm  sm:leading-6 read-only:!cursor-not-allowed read-only:!bg-[#ededed]',
  error = 'py-3 px-4 block w-full border-red-500 rounded text-sm focus:border-red-500 focus:ring-red-500 read-only:!cursor-not-allowed read-only:!bg-[#ededed]',
  success = 'py-3 px-4 block w-full border-teal-500 rounded text-sm focus:border-teal-500 focus:ring-teal-500 read-only:!cursor-not-allowed read-only:!bg-[#ededed]',
}

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule,NgClass],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NumericOnlyDirective, 
      inputs: ['isDecimalAllowed', 'minValue', 'maxValue', 'isNumericOnly', 'isForOTP']
    }
  ],
})
export class InputComponent<T> implements AfterViewInit, OnInit {
  readonly placeholder = input('');
  readonly label = input('')
  readonly type = input<InputType>('text');
  readonly isRequired = input<boolean>(false);
  readonly isDisabled = input<boolean>(false);
  readonly minValue = input<number>(0);
  readonly maxValue = input<number>(999999999999);
  readonly control = input<FormControl<T>>(new FormControl());
  readonly maxLength = input<number>(150);
  readonly classes = input<string>('');
  readonly customClasses = input<string>('')
  readonly validationText = input<string>('');
  readonly isExtraAttempt = input<boolean>(false);
  readonly extraLabel = input<string>('')
  
  valid = true;

  ngOnInit() {
    this.control().valueChanges.subscribe(value => {
      this.handleValueChange(value);
    });
  }

  private handleValueChange(value: T): void {
    const numericValue = +value;

    const isRequired = this.isRequired();
    if (!isRequired && (value === null || value === undefined || value === '')) {
      this.control().setErrors(null);
      this.styleClass = InputTypeStype.normal;
      this.name = InputStype.normal;
      this.valid = true;
      return;
    }

    if (isRequired && (!value || value === '')) {
      this.control().setErrors({ required: true });
      this.styleClass = InputTypeStype.error;
      this.name = InputStype.error;
      this.valid = false;
      return;
    }
    
    if (numericValue > this.maxValue() || numericValue < this.minValue()) {
      this.control().setErrors({ invalid: true });
      this.styleClass = InputTypeStype.error;
      this.name = InputStype.error;
      this.valid = false;
      return;
    }

    this.control().setErrors(null);
    this.styleClass = this.customClasses() ? this.customClasses() : InputTypeStype.normal;
    this.name = InputStype.normal;
    this.valid = true;
  }
  
  name = InputStype.normal;
  styleClass: string = InputTypeStype.normal;

  ngAfterViewInit(): void {
    reinitializePreline();
  }
}
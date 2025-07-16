import { ChangeDetectionStrategy, Component, Input, input, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent {
  readonly label = input('');
  readonly isRequired = input<boolean>(false);
  readonly isDisabled = input<boolean>(false);
  readonly name = input("");
  control = model(new FormControl(false));
  @Input() widthClass: string = '';
  @Input() textStyle: string = '';

  onClickLabel = () => {
    const val = !this.control().value;
    this.control().setValue(val);
  }

}

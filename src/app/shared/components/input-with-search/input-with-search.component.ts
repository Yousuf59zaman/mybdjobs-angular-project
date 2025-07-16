import { NgClass } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-with-search',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './input-with-search.component.html',
  styleUrl: './input-with-search.component.scss',
})
export class InputWithSearchComponent implements OnInit{
  readonly label = input('');
  readonly placeholder = input('');
  readonly isRequired = input<boolean>(false);
  readonly isDisabled = input<boolean>(false);
  readonly name = input('');
  readonly control = input<FormControl>(new FormControl());
  readonly isIcon = input(false);
  readonly searchBtnLabel = input('');
  readonly maxlength = input<number>(95); // Maximum length for the input value, default set to 95.
  @ViewChild('inpt') inpt!: ElementRef<HTMLInputElement>;
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.control().valueChanges
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value) => {
      if (!value) {
        this.inpt.nativeElement.value = value;
      }
    });
  }

  onSearchBtnClick(value: string) {
    const control = this.control();
    if (control) {
      control.setValue(value);
    }
  }

}

import { Component, ElementRef, HostListener, inject, input, Input, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { selectBoxItem} from '../../models/models';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-selectbox',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './selectbox.component.html',
  styleUrl: './selectbox.component.scss'
})
export class SelectboxComponent implements OnInit   {
  private eRef = inject(ElementRef);

  isDropdownOpen = signal(false);
  readonly customClasses = input<string>('') // added by Mehbub
  selectedItem = signal<selectBoxItem | null>(null);

  readonly options = input<selectBoxItem[]>([]);
  @Input() control!: FormControl;
  @Input() placeholder = 'Select an option';
  readonly label = input("Label");
  readonly isRequired = input(false);
  @Input() name = 'dropdown';
  @Input() onChange?: (value: any, index?: number) => void; // index is optional now
  @Input() formIndex?: number;

  ngOnInit() {
    const initial = this.control.value;
    if (initial) {
      const matched = this.options().find(opt => opt.value === initial);
      this.selectedItem.set(matched || null);
    }
    this.control.valueChanges
      .subscribe((value) => {
        const selected = this.options().find(item => item.value === value);
        this.selectedItem.set(selected || null);
        // Removed for production
        if (this.onChange) {
          this.onChange(value, this.formIndex); 
        }
    })

    if (initial && this.onChange) {
      this.onChange(initial, this.formIndex);
    }
  }


  selectItem(item: selectBoxItem) {
    this.control.setValue(item.value);
    this.selectedItem.set(item);
    this.isDropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen.set(false);
    }
  }
}
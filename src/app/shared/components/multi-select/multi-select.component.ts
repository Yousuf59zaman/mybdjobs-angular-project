import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
  input,
  model
} from '@angular/core';
import { MultiSelectQueryEvent, SelectItem } from '../../models/models';
import { FormControl, FormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Subject,
  takeUntil,
} from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectComponent implements OnInit, OnChanges, OnDestroy {
  readonly searchLabel = input<string | { key: string, params?: any }>('');
  suggestions = model<SelectItem[]>([]);
  readonly isFullWidth = input<boolean>(false);
  readonly overLayVisibleOnlyOnFocus = input<boolean>(false);
  readonly overLayVisibleOnlyOnSuggestions = input<boolean>(false);
  readonly dbncTime = input<number>(300);
  readonly multiplSelection = input<boolean>(true);
  readonly maxSelection = input<number>(0);
  readonly resetOnSelection = input<boolean>(false);
  readonly checkBoxVisible = input<boolean>(true);
  readonly control = input<FormControl<SelectItem[]>>(new FormControl());
  readonly placeholder = input<string | { key: string, params?: any }>('Search')
  readonly extraLabel = input<string | { key: string, params?: any }>('')
  readonly isSearchBox = input<boolean>(true);
  readonly isSourceChanged = input<boolean>(false);
  readonly displayValue = input<string>('');
  clickedInside = false;

  @Output() searchQuery: EventEmitter<MultiSelectQueryEvent> =
    new EventEmitter<MultiSelectQueryEvent>();
  @Output() onSelect: EventEmitter<SelectItem[]> =
    new EventEmitter<SelectItem[]>();

  searchQueryInput = signal<string>('');
  isOverLayVisible = signal(false);

  isDestroyed$: Subject<boolean> = new Subject();
  @Output() inputBlur = new EventEmitter<string>();


  @ViewChild('parentDivRef') parentDivRef: ElementRef | null = null;

  constructor() {
    const inputStream$ = toObservable(this.searchQueryInput);

    inputStream$
      .pipe(
        distinctUntilChanged(),
        debounceTime(this.dbncTime()),
        map((query) => query.trim()),
        // filter((str) => str.trim().length !== 0),
        takeUntil(this.isDestroyed$)
      )
      .subscribe({
        next: (query) => { this.searchQuery.emit({ query }) },
      });
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['suggestions']?.currentValue) {
      if (!changes?.['suggestions'].isFirstChange()) {
        this.showOverLay();
      }
    }
    if (changes?.['suggestions']?.currentValue && this.isSourceChanged() === true) {
      this.control().setValue([]);
    }
  }

  ngOnInit(): void {
    this.showOverLay();
  }

  showOverLay() {
    if (this.getOverLayVisibleOnlyOnSuggestions() && !this.suggestions?.length && !this.searchQueryInput().trim()) {
      this.setIsOverLayVisible(false);
      return;
    }

    if (this.isOverLayVisible() || this.getOverLayVisibleOnlyOnFocus()) {
      return;
    }

    this.setIsOverLayVisible(true);
  }

  // use only when overLayVisibleOnlyOnFocus = true
  hideOverLay() {
    this.setIsOverLayVisible(false);
  }

  setIsOverLayVisible(value: boolean) {
    this.isOverLayVisible.set(value);
  }

  onSearchInputFocus() {
    if (this.isOverLayVisible()) {
      return;
    }

    if (this.isSuggestionsAvailable(this.suggestions())) {
      this.setIsOverLayVisible(true);
    }
  }

  onSearchInputBlur() { 
      // Emit the raw text input so the parent can handle it
    const typedValue = this.searchQueryInput();
    this.inputBlur.emit(typedValue.trim());

    
  }

  isSuggestionsAvailable(suggestions: SelectItem[]): boolean {
    return !!suggestions?.length;
  }

  getOverLayVisibleOnlyOnFocus(): boolean {
    return this.overLayVisibleOnlyOnFocus();
  }

  getOverLayVisibleOnlyOnSuggestions(): boolean {
    return this.overLayVisibleOnlyOnSuggestions();
  }

  // use only when overLayVisibleOnlyOnFocus = true
  @HostListener('document:mousedown', ['$event'])

  handleClickOutside(event: MouseEvent) {
    // if (!this.getOverLayVisibleOnlyOnFocus()) {
    //   return;
    // }
    const source = event.target;

    if (
      this.parentDivRef?.nativeElement &&
      !this.parentDivRef.nativeElement.contains(source)
    ) {
      this.hideOverLay();
    }
  }

  toggleSelection(item: SelectItem) {
    item.isSelected = !item.isSelected;
    const selectedItems: SelectItem[] = [...(this.control()?.value || [])];
    if (item.isSelected) {
      const maxSelection = this.maxSelection();
      if (maxSelection && selectedItems.length === maxSelection) {
        item.isSelected = false;
        return;
      }
      selectedItems.push(item);
    } else {
      const itemIndex = selectedItems.findIndex(selectedItem => selectedItem.value === item.value);
      if (itemIndex > -1) {
        selectedItems.splice(itemIndex, 1);
      }
    }

    const control = this.control();
    if (control) {
      control.setValue(selectedItems);
    }

    if (!this.multiplSelection() && this.resetOnSelection()) {
      this.searchQueryInput.set("");
      this.suggestions.set([]);
    }

    this.onSelect.emit(selectedItems);
  }

  // TODO: following not working, make it work later
  handleKeypress(event: KeyboardEvent, item: any) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault(); // Prevent the default action to avoid scrolling
      this.toggleSelection(item);
    }
  }


  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.searchQueryInput.set(target.value);
    }
  }

 
  get placeholderText(): string {
    const value = this.placeholder();
    if (typeof value === 'string') {
      return value;
    } else if (value && typeof value === 'object' && value.key) {
      // If you use Transloco or similar, you can inject the translation service and use it here
      // For now, just return the key (replace with translation logic as needed)
      // Example: return this.translocoService.translate(value.key, value.params);
      return value.key;
    }
    return '';
  }

  get extraLabelText(): string {
    const value = this.extraLabel();
    if (typeof value === 'string') {
      return value;
    } else if (value && typeof value === 'object' && value.key) {
      // If you use Transloco or similar, you can inject the translation service and use it here
      // For now, just return the key (replace with translation logic as needed)
      // Example: return this.translocoService.translate(value.key, value.params);
      return value.key;
    }
    return '';
  }

  get searchLabelText(): string {
    const value = this.searchLabel();
    if (typeof value === 'string') {
      return value;
    } else if (value && typeof value === 'object' && value.key) {
      // If you use Transloco or similar, you can inject the translation service and use it here
      // For now, just return the key (replace with translation logic as needed)
      // Example: return this.translocoService.translate(value.key, value.params);
      return value.key;
    }
    return '';
  }

}
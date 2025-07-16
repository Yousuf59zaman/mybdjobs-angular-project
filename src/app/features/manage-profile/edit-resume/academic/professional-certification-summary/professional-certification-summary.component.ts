import { Component, computed, ElementRef, EventEmitter, HostListener, inject, input, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { DateRangePickerComponent } from '../../../../../shared/components/date-range-picker/date-range-picker.component';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';
import { SelectboxComponent } from '../../../../../shared/components/selectbox/selectbox.component';
import { NoDetailsSummaryComponent } from '../no-details-training-summary/no-details-training-summary.component';



@Component({
  selector: 'app-professional-certification-summary',
  imports: [
    // SelectboxComponent,
    DateRangePickerComponent,
    // NoDetailsSummaryComponent,
    InputComponent,
    ReactiveFormsModule,
    NoDetailsSummaryComponent
],
  templateUrl: './professional-certification-summary.component.html',
  styleUrl: './professional-certification-summary.component.scss'
})
export class ProfessionalCertificationSummaryComponent implements OnChanges {

  private accordionService = inject(AccordionManagerService);

  isAcademicSummaryExpanded = false;
  showDatepicker = false;
  showDurationDatepicker = false;
  showDatePicker = false;
  dateControl = new FormControl();
  showTooltip = false;

  private id = "professional-certificate-summary"
  isProfCertificateSummaryOpen = input(false);
  isProfCertificateSummaryFormOpen = signal(false);

  calendarVisible = false;
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  dateRangeString = '';
  @ViewChild('container', { static: true }) containerRef!: ElementRef;
  constructor(private _eref: ElementRef) { }
  isExpanded = false;
  @Output() addExperience = new EventEmitter<void>();

  toggleDropdown() {
    this.isExpanded = !this.isExpanded;
  }

  handleAddExperience() {
    this.addExperience.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isProfCertificateSummaryOpen() && !this.isOpen()) {
      this.toggle();
    }
  }

  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    this.accordionService.toggle(this.id);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!this.containerRef.nativeElement.contains(target)) {
      this.calendarVisible = false;
    }
  }

  toggleCalendar() {
    this.calendarVisible = !this.calendarVisible;
  }

  onStartDateChange(date: Date | null) {
    this.selectedStartDate = date;
    this.updateDateRangeString();
  }

  onEndDateChange(date: Date | null) {
    this.selectedEndDate = date;
    this.updateDateRangeString();
  }

  updateDateRangeString() {
    if (this.selectedStartDate && this.selectedEndDate) {
      this.dateRangeString = `${this.formatDate(this.selectedStartDate)} - ${this.formatDate(this.selectedEndDate)}`;
    } else if (this.selectedStartDate) {
      this.dateRangeString = this.formatDate(this.selectedStartDate);
    } else {
      this.dateRangeString = '';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  openDatePicker(): void {
    this.showDatePicker = true;
  }

  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
    console.log('Datepicker visible:', this.showDatePicker);

    if (!this.showDatePicker) {
      this.dateControl.reset();
    }
  }

  toggleDurationDatepicker() {
    this.showDurationDatepicker = !this.showDurationDatepicker;
  }

  toggleDatepicker() {
    this.showDatepicker = !this.showDatepicker;
  }

  toggleAcademicSummary() {
    this.isAcademicSummaryExpanded = !this.isAcademicSummaryExpanded;
  }

  @Output() onClose = new EventEmitter<void>()
  result = signal([
    {
      label: 'First Divison',
      value: 'First Divison',
    },
    {
      label: 'Second Divison',
      value: 'Second Divison',
    },
    {
      label: 'Third Division',
      value: 'Third Division',
    }
  ]);

  year = signal([
    {
      label: '2010',
      value: '2010'
    },
    {
      label: '2011',
      value: '2011'
    },
    {
      label: '2012',
      value: '2012'
    },
  ]);

  form = new FormGroup({
    certification: new FormControl(''),
    institute: new FormControl(''),
    location: new FormControl(''),
  });

  certificationControl = computed(
    () => this.form.get('certification') as FormControl<string>
  )

  instituteControl = computed(
    () => this.form.get('institute') as FormControl<string>
  )

  locationControl = computed(
    () => this.form.get('location') as FormControl<string>
  )

  closeForm() {
    this.onClose.emit()
  }

}

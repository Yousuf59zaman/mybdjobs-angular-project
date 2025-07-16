import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, inject, input, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectboxComponent } from '../../../../../shared/components/selectbox/selectbox.component';
import { DateRangePickerComponent } from '../../../../../shared/components/date-range-picker/date-range-picker.component';
import { NoDetailsSummaryComponent } from '../../academic/no-details-training-summary/no-details-training-summary.component';
import { TextEditorComponent } from '../../../../../shared/components/text-editor/text-editor.component';
import { AccordionMainBodyComponent } from '../../../../../shared/components/accordion-main-body/accordion-main-body.component';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';
import {TrainingSummary } from '../../../../../shared/models/models';

@Component({
  selector: 'app-references',
 imports: [SelectboxComponent, DateRangePickerComponent, ReactiveFormsModule, CommonModule, FormsModule, TextEditorComponent, AccordionMainBodyComponent],
  templateUrl: './references.component.html',
  styleUrl: './references.component.scss'
})
export class ReferencesComponent {
  private accordionService = inject(AccordionManagerService)


  isReferencesOpen = input(false)
  isReferencesNewFormOpen = signal(false);
  isReferencesEditFormOpen = signal(false);
  private id = "referencesinfo"


  isAcademicSummaryExpanded = false;
   showForm = false;
    calendarVisible = false;
    selectedStartDate: Date | null = null;
    selectedEndDate: Date | null = null;
    dateRangeString = '';
    @ViewChild('container', { static: true }) containerRef!: ElementRef;
    // Add this property
  showTraining2 = false;


  ngOnChanges(changes: SimpleChanges): void {
    if(this.isReferencesOpen() && !this.isOpen()) {
      this.toggle();
    }
  }

  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    this.accordionService.toggle(this.id);
  }

    trainingSummaries: TrainingSummary[] = [
      {
        id: 1,
        title: 'Name',
        country: 'ceo',
        topics: 'abc',
        year: 'abc@gmail.com',
        institute: '019999999',
        duration: '1234455',
        location: '---'
      }
    ];

    editingSummary: TrainingSummary | null = null;
    nextId = 2; // Start from 2 since we have one example

    constructor(private _eref: ElementRef,private cdRef: ChangeDetectorRef) {}

    // Form setup with validation
    form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      topics: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required]),
      institute: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      location: new FormControl('')
    });

    // Dropdown options
    year = signal([
      { label: '2010', value: '2010' },
      { label: '2011', value: '2011' },
      { label: '2012', value: '2012' },
      { label: '2013', value: '2013' },
      { label: '2014', value: '2014' },
      { label: '2015', value: '2015' },
      { label: '2016', value: '2016' },
      { label: '2017', value: '2017' },
      { label: '2018', value: '2018' },
      { label: '2019', value: '2019' },
      { label: '2020', value: '2020' },
      { label: '2021', value: '2021' },
      { label: '2022', value: '2022' },
      { label: '2023', value: '2023' },
      { label: '2024', value: '2024' },
      { label: '2025', value: '2025' },
      { label: '2026', value: '2026' },
      { label: '2027', value: '2027' },
      { label: '2028', value: '2028' },
      { label: '2029', value: '2029' },
      { label: '2030', value: '2030' }
    ]);

    // Toggle sections
    toggleAcademicSummary() {
      this.isAcademicSummaryExpanded = !this.isAcademicSummaryExpanded;
      if (!this.isAcademicSummaryExpanded) {
        this.resetForm();
      }
    }

    // Form operations
    addNewTraining() {
      this.showForm = true;
      this.editingSummary = null;
      this.resetForm();
      this.isAcademicSummaryExpanded = true;
    }

    editSummary(summary: TrainingSummary) {
      this.editingSummary = summary;
      this.showForm = true;
      this.isAcademicSummaryExpanded = true;

      this.form.patchValue({
        title: summary.title,
        country: summary.country,
        topics: summary.topics,
        year: summary.year,
        institute: summary.institute,
        duration: summary.duration,
        location: summary.location
      });

      this.dateRangeString = summary.duration;
    }

    saveTrainingSummary() {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      const formValue = {
        id: this.editingSummary ? this.editingSummary.id : this.nextId++,
        title: this.form.value.title || '',
        country: this.form.value.country || '',
        topics: this.form.value.topics || '',
        year: this.form.value.year || '',
        institute: this.form.value.institute || '',
        duration: this.dateRangeString || this.form.value.duration || '',
        location: this.form.value.location || ''
      };

      if (this.editingSummary) {
        // Update existing
        const index = this.trainingSummaries.findIndex(s => s.id === this.editingSummary?.id);
        if (index !== -1) this.trainingSummaries[index] = formValue;
      } else {
        // Add new
        this.trainingSummaries.push(formValue);
      }

      this.resetForm();
      this.showForm = false;
    }

    deleteSummary(id: number) {
      this.trainingSummaries = this.trainingSummaries.filter(s => s.id !== id);
      if (this.editingSummary?.id === id) {
        this.resetForm();
      }
    }

    resetForm() {
      this.form.reset();
      this.editingSummary = null;
      this.dateRangeString = '';
      this.selectedStartDate = null;
      this.selectedEndDate = null;
    }

    closeForm() {
      this.resetForm();
      this.showForm = false;
    }

    // Date picker functionality
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
        const diffTime = Math.abs(this.selectedEndDate.getTime() - this.selectedStartDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)); // Approximate months
        this.dateRangeString = diffDays.toString();
        this.form.patchValue({ duration: diffDays.toString() });
      } else if (this.selectedStartDate) {
        this.dateRangeString = this.formatDate(this.selectedStartDate);
      } else {
        this.dateRangeString = '';
      }
    }

    formatDate(date: Date): string {
      return date.toLocaleDateString();
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (!this.containerRef.nativeElement.contains(target)) {
        this.calendarVisible = false;
      }
    }

    // Helper getters
    get resultControl(): FormControl {
      return this.form.get('year') as FormControl;
    }

    get titleControl(): FormControl {
      return this.form.get('title') as FormControl;
    }

    get countryControl(): FormControl {
      return this.form.get('country') as FormControl;
    }

    get topicsControl(): FormControl {
      return this.form.get('topics') as FormControl;
    }

    get instituteControl(): FormControl {
      return this.form.get('institute') as FormControl;
    }

    get durationControl(): FormControl {
      return this.form.get('duration') as FormControl;
    }

showEditor = false;


showTraining2Form() {
  this.showTraining2 = true;
  this.cdRef.detectChanges(); // Force change detection
}



}

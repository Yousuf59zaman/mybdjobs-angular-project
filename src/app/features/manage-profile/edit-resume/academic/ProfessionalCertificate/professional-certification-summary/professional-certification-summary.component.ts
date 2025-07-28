import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  input,
  OnChanges,
  Output,
  Signal,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { DatepickerComponent } from '../../../../../../shared/components/datepicker/datepicker.component';
import { AccordionManagerService } from '../../../../../../shared/services/accordion.service';
import { DateRangePickerComponent } from '../../../../../../shared/components/date-range-picker/date-range-picker.component';
import { AccordionMainBodyComponent } from '../../../../../../shared/components/accordion-main-body/accordion-main-body.component';

import { InputComponent } from '../../../../../../shared/components/input/input.component';
import { SelectboxComponent } from '../../../../../../shared/components/selectbox/selectbox.component';
import { NoDetailsComponent } from '../../../../../../shared/components/no-details/no-details.component';
import { NoDetailsSummaryComponent } from '../../no-details-training-summary/no-details-training-summary.component';
import { ProfessionalCertificateService } from '../services/professional-certificate.service';
import {
  InsertProfessionalCertificate,
  PostApiResponse,
  ProfessionalCertificationPayload,
} from '../models/professinal-certification-model';
import { finalize } from 'rxjs';
import { provideTranslocoScope, TranslocoDirective, TranslocoModule } from '@jsverse/transloco';
import { CookieService } from '../../../../../../core/services/cookie/cookie.service';

@Component({
  selector: 'app-professional-certification-summary',
  imports: [
    // SelectboxComponent,
    DateRangePickerComponent,
    // NoDetailsSummaryComponent,
    InputComponent,
    NgClass,
    CommonModule,
    ReactiveFormsModule,
    NoDetailsSummaryComponent,
    AccordionMainBodyComponent,
    NoDetailsComponent,
    TranslocoDirective,
    TranslocoModule
],
  templateUrl: './professional-certification-summary.component.html',
  styleUrl: './professional-certification-summary.component.scss',
  providers: [provideTranslocoScope('professionalCertificate')]
})
export class ProfessionalCertificationSummaryComponent implements OnChanges {
  private accordionService = inject(AccordionManagerService);
  private certificationService = inject(ProfessionalCertificateService);
  private fb = inject(FormBuilder);
  private cookieService = inject(CookieService);
  isLoading = signal(true);
  isAcademicSummaryExpanded = false;
  showDatepicker = false;
  showDurationDatepicker = false;
  showDatePicker = false;
  dateControl = new FormControl();
  showTooltip = false;
  isInfoAvailable = signal(false);
  private id = 'professional-certificate-summary';
  isProfCertificateSummaryOpen = input(false);
  isProfCertificateSummaryFormOpen = signal(false);
  isNewFormOpen = signal(false);
  calendarVisible = false;
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  dateRangeString = '';
  @ViewChild('container', { static: true }) containerRef!: ElementRef;
  constructor(private _eref: ElementRef) {}
  isExpanded = false;
  @Output() addExperience = new EventEmitter<void>();
  userGuid = '';
  toggleDropdown() {
    this.isExpanded = !this.isExpanded;
  }

  handleAddExperience() {
    this.addExperience.emit();
  }

  ngOnInit() {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || '';
    this.userGuid = rawGuid ? decodeURIComponent(rawGuid) : "";
  }
  loadCertifications() {
    this.isLoading.set(true);
    this.certificationService
    .getCertifications(this.userGuid)
    .pipe(finalize(() => {
      this.isLoading.set(false);
    }))
    .subscribe({
      next: (response) => {
        const raw = response.event.eventData.find(d => d.key === 'message')?.value;
        const certs = Array.isArray(raw) ? raw : [];
        this.professionalCertifications = certs;
        this.isInfoAvailable.set(certs.length > 0);
      },
      error: (err) => {
        console.error('error fetching certification data', err);
        this.isInfoAvailable.set(false);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isProfCertificateSummaryOpen() && !this.isOpen()) {
      const willOpen = !this.accordionService.isOpen(this.id)();
      this.toggle();
      if (willOpen) {
        this.loadCertifications();
      }
    }
  }


  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    this.accordionService.toggle(this.id);
  }
  openCertificationData()
  {
    this.isInfoAvailable.set(true)
    this.isNewFormOpen.set(true)
    this.showCertificationForm()
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
      this.dateRangeString = `${this.formatDate(
        this.selectedStartDate
      )} - ${this.formatDate(this.selectedEndDate)}`;
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

  @Output() onClose = new EventEmitter<void>();

  certificationControl = computed(
    () => this.certificationForm.get('certification') as FormControl<string>
  );

  instituteControl = computed(
    () => this.certificationForm.get('institute') as FormControl<string>
  );

  locationControl = computed(
    () => this.certificationForm.get('location') as FormControl<string>
  );

  closeForm() {
    this.onClose.emit();
  }

  bindForm(value: any) {
    this.certificationControl().setValue(value.certificationTitle);
    this.instituteControl().setValue(value.institute);
    this.locationControl().setValue(value.location);

    if (value.fromDate) {
      this.editSelectedStartDate = new Date(value.fromDate);
    } else {
      this.editSelectedStartDate = null;
    }

    if (value.toDate) {
      this.editSelectedEndDate = new Date(value.toDate);
    } else {
      this.editSelectedEndDate = null;
    }

    // 2) Build your “display” string (if you still want to show it as text):
    this.editDateRangeString =
      this.editSelectedStartDate && this.editSelectedEndDate
        ? `${this.formatDate(this.editSelectedStartDate)} - ${this.formatDate(
            this.editSelectedEndDate
          )}`
        : this.editSelectedStartDate
        ? this.formatDate(this.editSelectedStartDate)
        : '';
  }

  professionalCertifications: any[] = [];

  dateRangeValidator: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const form = group as FormGroup;
    const start: Date | null = form.get('startDate')?.value;
    const end: Date | null = form.get('endDate')?.value;

    if (start && end) {
      // If end is before start → invalid
      if (new Date(end) < new Date(start)) {
        return { dateRangeInvalid: true };
      }
    }
    return null;
  };

  editingCertification: any = null;

  certificationForm: FormGroup = this.fb.group(
    {
      certification: ['', [Validators.required, Validators.maxLength(80)]],
      institute: ['', [Validators.required, Validators.maxLength(80)]],
      location: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    },
    { validators: this.dateRangeValidator }
  );

  newCertificationForm = this.fb.group(
    {
      certification: ['', [Validators.required, Validators.maxLength(80)]],
      institute: ['', [Validators.required, Validators.maxLength(80)]],
      location: ['', [Validators.required, Validators.maxLength(50)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    },
    { validators: this.dateRangeValidator }
  );

  newcertificationControl = computed(
    () => this.newCertificationForm.get('certification') as FormControl<string>
  );
  newinstituteControl = computed(
    () => this.newCertificationForm.get('institute') as FormControl<string>
  );
  newlocationControl = computed(
    () => this.newCertificationForm.get('location') as FormControl<string>
  );

  editingCertificationId: string | null = null;
  editCertification(certification: any) {
    this.editingCertificationId = certification.pe_ID;
    this.editingCertification = certification;
    this.bindForm(certification);
    this.certificationForm.patchValue({
      certification: certification.certificationTitle,
      institute: certification.institute,
      location: certification.location,
      startDate: this.editSelectedStartDate,
      endDate: this.editSelectedEndDate,
    });
  }

  saveCertification() {
    if (this.certificationForm.invalid) {
      this.certificationForm.markAllAsTouched();
      return;
    }
    const dates = this.editDateRangeString?.split(' - ') || [];
    const startDateStr = dates[0];
    const endDateStr = dates[1];

    const updatePayload: ProfessionalCertificationPayload = {
      certification: this.certificationForm.value.certification,
      institute: this.certificationForm.value.institute,
      location: this.certificationForm.value.location,
      startDate: this.toIsoOrEmpty(startDateStr),
      endDate: this.toIsoOrEmpty(endDateStr),
      userGuid:
        this.userGuid,
      pe_ID: this.editingCertification?.pe_ID,
    };

    this.certificationService.updateCertification(updatePayload).subscribe({
      next: (res: PostApiResponse[]) => {
        const successEvent = res[0];
        if (successEvent.eventType === 1) {
          this.loadCertifications();
          this.closeCertificationForm();
          this.isProfCertificateSummaryFormOpen.set(false);
        }
      },
      error: (err) => {
        console.error('Update failed', err);
      },
    });
  }
  toIsoOrEmpty = (dateStr?: string): string => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const offsetMs = d.getTimezoneOffset() * 60000;
    const utcDate = new Date(d.getTime() - offsetMs);

    return utcDate.toISOString();
  };

  closeCertificationForm() {
    this.editingCertification = null;
    this.editingCertificationId = null;
    this.certificationForm.reset();
    this.certificationForm.markAsUntouched();
  }

  showCertificationForm() {
    this.isProfCertificateSummaryFormOpen.set(true);
    this.newCertificationForm.reset();
  }
  isSaving = signal(false);

  addCertification() {
    if (this.newCertificationForm.invalid) {
      this.newCertificationForm.markAllAsTouched();
      return;
    }
    if (this.isSaving()) {
      return;
    }
    this.isSaving.set(true);
    // Build payload for POST
    const newAddPayload: InsertProfessionalCertificate = {
      certification: this.newCertificationForm.value.certification || '',
      institute: this.newCertificationForm.value.institute || '',
      location: this.newCertificationForm.value.location || '',
      startDate: this.toIsoOrEmpty(this.newDateRangeString.split(' - ')[0]),
      endDate: this.toIsoOrEmpty(this.newDateRangeString.split(' - ')[1]),
      userGuid:this.userGuid,
    };
    this.certificationService.createCertification(newAddPayload).subscribe({
      next: () => {
        this.loadCertifications();
        this.closeNewCertificationForm();
      },
      error: (err) => {
        console.error('Add certification failed', err);
      },
    });
  }

  closeNewCertificationForm() {
    this.isProfCertificateSummaryFormOpen.set(false);
    this.newCertificationForm.reset();
  }
  editCalendarVisible = false;
  editSelectedStartDate: Date | null = null;
  editSelectedEndDate: Date | null = null;
  editDateRangeString = '';
  newCalendarVisible = false;
  newSelectedStartDate: Date | null = null;
  newSelectedEndDate: Date | null = null;
  newDateRangeString = '';
  toggleEditCalendar(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.editCalendarVisible = !this.editCalendarVisible;
    if (this.editCalendarVisible) {
      const dateRangeString = `${this.editingCertification.fromDate} - ${this.editingCertification.toDate}`;
      const dates = this.parseDateRangeString(dateRangeString);
      this.editSelectedStartDate = dates.start;
      this.editSelectedEndDate = dates.end;
    }
  }

  private parseDateRangeString(rangeString: string): {
    start: Date | null;
    end: Date | null;
  } {
    if (!rangeString) return { start: null, end: null };

    const parts = rangeString.split(' - ');
    try {
      const start = parts[0] ? new Date(parts[0]) : null;
      const end = parts[1] ? new Date(parts[1]) : null;
      return { start, end };
    } catch {
      return { start: null, end: null };
    }
  }

  onEditStartDateChange(date: Date | null) {
    this.editSelectedStartDate = date;
    this.updateEditDateRangeString();
    this.certificationForm.patchValue({ startDate: date });
  }
  onEditEndDateChange(date: Date | null) {
    this.editSelectedEndDate = date;
    this.updateEditDateRangeString();
    this.certificationForm.patchValue({ endDate: date });
  }
  updateEditDateRangeString() {
    if (this.editSelectedStartDate && this.editSelectedEndDate) {
      this.editDateRangeString = `${this.formatDate(
        this.editSelectedStartDate
      )} - ${this.formatDate(this.editSelectedEndDate)}`;
    } else if (this.editSelectedStartDate) {
      this.editDateRangeString = this.formatDate(this.editSelectedStartDate);
    } else {
      this.editDateRangeString = '';
    }
  }

  toggleNewCalendar(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.newCalendarVisible = !this.newCalendarVisible;
  }

  closeNewCalendar() {
    this.newCalendarVisible = false;
  }
  onNewStartDateChange(date: Date | null) {
    this.newSelectedStartDate = date;
    this.updateNewDateRangeString();
    this.newCertificationForm.patchValue({ startDate: date?.toString() });
  }

  onNewEndDateChange(date: Date | null) {
    this.newSelectedEndDate = date;
    this.updateNewDateRangeString();
    this.newCertificationForm.patchValue({ endDate: date?.toString() });
  }
  updateNewDateRangeString() {
    if (this.newSelectedStartDate && this.newSelectedEndDate) {
      this.newDateRangeString = `${this.formatDate(
        this.newSelectedStartDate
      )} - ${this.formatDate(this.newSelectedEndDate)}`;
    } else if (this.newSelectedStartDate) {
      this.newDateRangeString = this.formatDate(this.newSelectedStartDate);
    } else {
      this.newDateRangeString = '';
    }
  }

  confirmEditSelection() {
    this.editCalendarVisible = false;
  }

  // your-component.ts
pendingDeleteId = signal<number|null>(null);
isDeleteModalOpen = signal(false);

openDeleteModal(id: number) {
  this.pendingDeleteId.set(id);
  this.isDeleteModalOpen.set(true);
  document.body.style.overflow = 'hidden';
}

closeDeleteModal() {
  this.isDeleteModalOpen.set(false);
  document.body.style.overflow = '';
}

confirmDelete() {
  const id = this.pendingDeleteId();
  if (id === null) return;

  const userGuid = this.userGuid;
  this.certificationService.deleteCertification(id, userGuid)
    .subscribe({
      next: (res) => {
        this.loadCertifications();
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Delete failed', err);
      }
    });
}

onExpandClick() {
    const willOpen = !this.accordionService.isOpen(this.id)();
    this.toggle(); // toggles the accordion

    if (willOpen) {
      this.loadCertifications();
    }
  }

}

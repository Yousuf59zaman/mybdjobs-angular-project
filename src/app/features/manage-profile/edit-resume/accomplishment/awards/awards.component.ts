import { ChangeDetectorRef, Component, computed, ElementRef, EventEmitter, HostListener, inject, input, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { DateSingleDatePickerComponent } from '../../../../../shared/components/date-single-date-picker/date-single-date-picker.component';
import { TextEditorComponent } from '../../../../../shared/components/text-editor/text-editor.component';
import { AccordionMainBodyComponent } from '../../../../../shared/components/accordion-main-body/accordion-main-body.component';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';
import { NoDetailsSummaryComponent } from '../../academic/no-details-training-summary/no-details-training-summary.component';
import { AccomplishmentEventDataItem, AccomplishmentInfoQuery, AccomplishmentUpdateInsert, DeleteAccomplishmentRequest } from '../model/accomplishment';
import { AccomplishmentService } from '../service/accomplishment.service';
import { NoDetailsComponent } from "../../../../../shared/components/no-details/no-details.component";
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { InputComponent } from "../../../../../shared/components/input/input.component";
import { ToasterService } from '../../../../../shared/services/toaster.service';
import { CookieService } from '../../../../../core/services/cookie/cookie.service';
@Component({
  selector: 'app-awards',
  imports: [
    DateSingleDatePickerComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TextEditorComponent,
    NgClass,
    AccordionMainBodyComponent,
    NoDetailsComponent, TranslocoModule,
    InputComponent
  ],
  providers: [provideTranslocoScope('editResumeAccomplishment')],
  templateUrl: './awards.component.html',
  styleUrl: './awards.component.scss'
})

export class AwardsComponent implements OnChanges {
  private accordionService = inject(AccordionManagerService)
  private accompolishmentService = inject(AccomplishmentService)

  isAwardHonorsOpen = input(false);
  isAwardNewFormOpen = signal(false);
  isAwardEditFormOpen = signal(false);
  isDeleteModalOpen = signal(false);
  isLoading = signal(true);
  maxLengthError = signal(false);
  isInfoAvailable = false;
  formSubmitted = false;
  isAwardExpanded = false;
  showForm = false;
  calendarVisible = false;
  descriptionCharCount = signal(0);
  readonly MAX_DESCRIPTION_LENGTH = 300;
  private id = "accomplishmentaward";
  editResumeControl = new FormControl('')
  private accomPlishmentId: number | null = null;
  toaster = inject(ToasterService);
  summary: AccomplishmentEventDataItem | null = null;
  awardSummaries: AccomplishmentEventDataItem[] = [];
  editingSummary: AccomplishmentEventDataItem | null = null;
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  dateRangeString = '';

  @ViewChild('container', { static: true }) containerRef!: ElementRef;
  showAward = false;

  @ViewChild('textEditor') textEditor: any;
  @Output() contentChanged = new EventEmitter<string>();

  nextId = 2;

  constructor(private _eref: ElementRef, private cdRef: ChangeDetectorRef, private cookieService: CookieService) { }

  awardForm = new FormGroup({
    accomplishmentId: new FormControl<number | null>(null),
    title: new FormControl('', [Validators.required]),
    issueDate: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });



  ngOnChanges(changes: SimpleChanges): void {
    if (this.isAwardHonorsOpen() && !this.isOpen()) {
      const willOpen = !this.accordionService.isOpen(this.id)();
      this.toggle();
      if (willOpen) {
        this.loadAwardInfo();
      }
    }
  }

  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    const willOpen = !this.accordionService.isOpen(this.id)();
    this.accordionService.toggle(this.id);
    if (willOpen) {
      this.loadAwardInfo();
    }
  }

  resetForm(): void {
    this.awardForm.reset({
      accomplishmentId: null,
      title: '',
      issueDate: '',
      url: '',
      description: ''
    }, { emitEvent: false });
    this.editingSummary = null;
    this.dateRangeString = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
  }

  closeForm(): void {
    this.resetForm();
    this.showForm = false;
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
      const diffTime = Math.abs(this.selectedEndDate.getTime() - this.selectedStartDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)); // Approximate months
      this.dateRangeString = diffDays.toString();
      this.awardForm.patchValue({ issueDate: diffDays.toString() });
    } else if (this.selectedStartDate) {
      this.dateRangeString = this.formatDate(this.selectedStartDate);
    } else {
      this.dateRangeString = '';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
  closeDeleteModal() {
    this.isDeleteModalOpen.set(false);
    this.accomPlishmentId = null;
    document.body.style.overflow = '';
  }

  openDeleteModal(accomPlishmentId: number) {
    this.accomPlishmentId = accomPlishmentId;
    this.isDeleteModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  confirmDelete() {
    if (this.accomPlishmentId !== null) {
      const request: DeleteAccomplishmentRequest = {
        acmId: this.accomPlishmentId,
        userGuid: 'ZRDhZ7YxZEYyITPbBQ00PFPiMTDhBTUyPRmbPxdxYiObIFZ9BFPtBFVUIGL3Ung='
      };

      this.accompolishmentService.deleteInfo(request).subscribe({
        next: (response) => {
          const errorEvent = response.find(r => r.eventType === 2);
          if (errorEvent) {
            const errorMessage = errorEvent.eventData.find(d => d.key === 'message')?.value[0] || 'Delete failed';
            console.error('Delete error:', errorMessage);
            return;
          }
          this.awardSummaries = this.awardSummaries.filter(p => p.accomPlishmentId !== this.accomPlishmentId);

          if (this.editingSummary?.accomPlishmentId === this.accomPlishmentId) {
            this.closeForm();
          }

          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting award:', error);
        }
      });
    }
  }


  toggleAwardSummary() {
    this.isAwardExpanded = !this.isAwardExpanded;
    if (!this.isAwardExpanded) {
      this.resetForm();
    }
  }

  addNewAward() {
    this.showForm = true;
    this.editingSummary = null;
    this.resetForm();
    this.isAwardExpanded = true;
  }

  editSummary(other: AccomplishmentEventDataItem) {
    this.editingSummary = other;
    this.showForm = true;
    this.isAwardExpanded = true;

    this.awardForm.patchValue({
      accomplishmentId: other.accomPlishmentId,
      title: other.title,
      issueDate: other.issuedOn,
      url: other.url,
      description: other.description
    });
  }

  closeawardForm(): void {
    this.isAwardNewFormOpen.set(false);
    this.editingSummary = null;
    this.awardForm.reset();
    this.dateRangeString = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.calendarVisible = false;
    this.formSubmitted = false;
  }

  openAddAwardForm(): void {
    this.resetForm();
    this.isAwardNewFormOpen.set(true);
    this.editingSummary = null;
    this.isAwardExpanded = true;
    this.calendarVisible = false;
    this.formSubmitted = false; // Ensure formSubmitted is reset
  }

  ngOnInit(): void {
    //this.loadAwardInfo();
    this.descriptionControl.valueChanges.subscribe(value => {
      if (value) {
        const plainText = this.stripHtmlTags(value);
        this.descriptionCharCount.set(plainText.length);
      } else {
        this.descriptionCharCount.set(0);
      }
    });
  }

  loadAwardInfo(): void {
    this.isLoading.set(true);
    const query: AccomplishmentInfoQuery = {
      UserGuid: 'ZRDhZ7YxZEYyITPbBQ00PFPiMTDhBTUyPRmbPxdxYiObIFZ9BFPtBFVUIGL3Ung='
    };

    // const rawGuid = this.cookieService.getCookie('MybdjobsGId') || 'ZiZuPid0ZRLyZ7S3YQ00PRg7MRgwPELyBTYxPRLzZESuYTU0BFPtBFVUIGL3Ung%3D'; // for development only
    // this.userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
    // console.log('User GUID ID Photo Component:', this.userGuidId);

    this.accompolishmentService.getAccomplishmentInfo(query, 3).subscribe({
      next: (summaries) => {
        this.awardSummaries = summaries;
        if (summaries && summaries.length > 0) {
          this.isInfoAvailable = true;
          this.summary = summaries[0];
          this.awardForm.patchValue({
            title: this.summary.title,
            issueDate: this.summary.issuedOn,
            url: this.summary.url,
            description: this.summary.description
          });
        } else {
          console.log('No award summaries received from API');
          this.isInfoAvailable = false;
          this.summary = null;
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading award summaries:', error);
        this.isInfoAvailable = false;
        this.summary = null;
        this.isLoading.set(false);
      }
    });
  }

  stripHtmlTags(html: string): string {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  saveAwardSummary() {
    this.isLoading.set(true);
    this.formSubmitted = true;
    Object.keys(this.awardForm.controls).forEach(key => {
      const control = this.awardForm.get(key);
      control?.markAsTouched();
    });

    const descriptionValue = this.descriptionControl.value;
    if (!descriptionValue || this.stripHtmlTags(descriptionValue).trim() === '') {
      this.descriptionControl.setErrors({ required: true });
      this.isLoading.set(false);
      return;
    }

    if (this.awardForm.invalid) {
      this.isLoading.set(false);
      return;
    }
    const formValue = this.awardForm.value;
    const command: AccomplishmentUpdateInsert = {
      userGuid: 'ZRDhZ7YxZEYyITPbBQ00PFPiMTDhBTUyPRmbPxdxYiObIFZ9BFPtBFVUIGL3Ung=',
      type: 3, // award type
      title: formValue.title || '',
      url: formValue.url || '',
      description: this.stripHtmlTags(formValue.description || ''),
      issueDate: new Date().toISOString()
    };

    // If we're editing an existing award, add the id
    if (this.editingSummary) {
      command.id = this.editingSummary.accomPlishmentId;
    }

    this.accompolishmentService.insertUpdateInfo(command).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        const successMsg = response.some(
          (r: any) =>
            r.eventType === 1 &&
            r.eventData.some((d: any) => d.key === 'Message' && d.value.includes('successfully'))
        );

        if (successMsg) {
          // Update local state
          if (this.editingSummary) {
            // Update existing award
            const idx = this.awardSummaries.findIndex(s => s.accomPlishmentId === this.editingSummary?.accomPlishmentId);
            if (idx > -1) {
              this.awardSummaries[idx] = {
                ...this.awardSummaries[idx],
                title: command.title,
                issuedOn: command.issueDate,
                url: command.url,
                description: command.description
              };
            }
          } else {
            // Add new award
            const newSummary: AccomplishmentEventDataItem = {
              accomPlishmentId: response[0]?.eventData?.[0]?.value?.[0]?.accomplishmentId || this.getNextId(),
              type: 3,
              title: command.title,
              url: command.url,
              description: command.description,
              issuedOn: command.issueDate
            };
            this.awardSummaries.push(newSummary);
          }
          this.closeawardForm();

          this.toaster.show('Award/Honors saved successfully!',
            {
              iconClass: 'lucide-check-circle',
              imageUrl: 'images/check-circle.svg',
              borderColor: 'bg-[#079455]'
            });
        } else {
          console.error('Operation failed:', response);
          this.toaster.show('Award/Honors saved failed!',
            {
              iconClass: 'lucide-check-circle',
              imageUrl: 'images/x-circle.svg',
              borderColor: 'bg-[#D92D20]'
            });
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('API Error:', error);
        this.toaster.show(this.editingSummary ? 'Award/Honors update failed!' : 'Award/Honors save failed!', {
          iconClass: 'lucide-check-circle',
          imageUrl: 'images/x-circle.svg',
          borderColor: 'bg-[#D92D20]'
        });
        this.isLoading.set(false);
      }
    });
  }

  private getNextId(): number {
    return this.awardSummaries.length > 0
      ? Math.max(...this.awardSummaries.map(s => s.accomPlishmentId)) + 1
      : 1;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.containerRef?.nativeElement) return;

    const target = event.target as HTMLElement;
    if (!this.containerRef.nativeElement.contains(target)) {
      this.calendarVisible = false;
    }
  }

  // Helper getters    
  get titleControl(): FormControl {
    return this.awardForm.get('title') as FormControl;
  }
  get issueDateControl(): FormControl {
    return this.awardForm.get('issueDate') as FormControl;
  }

  get urlControl(): FormControl {
    return this.awardForm.get('url') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.awardForm.get('description') as FormControl;
  }

  showEditor = false;

  showAwardForm() {
    this.showAward = true;
    this.cdRef.detectChanges();
  }
  onStartDateChanged(date: Date | null): void {
    if (date) {
      this.awardForm.patchValue({
        issueDate: date.toISOString()
      });
    }
  }
}



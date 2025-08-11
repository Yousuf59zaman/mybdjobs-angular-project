import { ChangeDetectorRef, Component, computed, ElementRef, EventEmitter, HostListener, inject, input, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { TextEditorComponent } from '../../../../../shared/components/text-editor/text-editor.component';
import { AccordionMainBodyComponent } from '../../../../../shared/components/accordion-main-body/accordion-main-body.component';
import { DateSingleDatePickerComponent } from '../../../../../shared/components/date-single-date-picker/date-single-date-picker.component';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';
import { NoDetailsSummaryComponent } from '../../academic/no-details-training-summary/no-details-training-summary.component';
import { AccomplishmentService } from '../service/accomplishment.service';
import { NoDetailsComponent } from "../../../../../shared/components/no-details/no-details.component";
import { InputComponent } from "../../../../../shared/components/input/input.component";
import { AccomplishmentEventDataItem, AccomplishmentInfoQuery, AccomplishmentUpdateInsert, DeleteAccomplishmentRequest, DeleteAccomplishmentResponse } from '../model/accomplishment';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { ToasterService } from '../../../../../shared/services/toaster.service';
import { CookieService } from '../../../../../core/services/cookie/cookie.service';


@Component({
  selector: 'app-publications',
  imports: [
    DateSingleDatePickerComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TextEditorComponent,
    NgClass,
    AccordionMainBodyComponent,
    NoDetailsComponent,
    InputComponent,
    TranslocoModule
  ],
  providers: [provideTranslocoScope('editResumeAccomplishment')],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.scss'
})
export class PublicationsComponent implements OnChanges {
  private accordionService = inject(AccordionManagerService)
  private accompolishmentService = inject(AccomplishmentService)
  toaster = inject(ToasterService);

  isPublicationsOpen = input(false);
  isPublicationsNewFormOpen = signal(false);
  isPublicationsEditFormOpen = signal(false);
  isDeleteModalOpen = signal(false);
  isLoading = signal(true);
  maxLengthError = signal(false);
  isInfoAvailable = false;
  formSubmitted = false;
  isPublicationExpanded = false;
  showForm = false;
  calendarVisible = false;
  descriptionCharCount = signal(0);
  readonly MAX_DESCRIPTION_LENGTH = 300;
  private id = "accomplishmentpublications";
  editResumeControl = new FormControl('')
  private accomPlishmentId: number | null = null;
  summary: AccomplishmentEventDataItem | null = null;
  publicationSummaries: AccomplishmentEventDataItem[] = [];
  editingSummary: AccomplishmentEventDataItem | null = null;
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  dateRangeString = '';
  userGuidId: string=''

  @ViewChild('container', { static: true }) containerRef!: ElementRef;
  // Add this property
  showPublication = false;

  @ViewChild('textEditor') textEditor: any;
  @Output() contentChanged = new EventEmitter<string>();

  nextId = 2;

  constructor(private _eref: ElementRef, private cdRef: ChangeDetectorRef,private cookieService: CookieService) { }
  publicationForm = new FormGroup({
    accomplishmentId: new FormControl<number | null>(null),
    title: new FormControl('', [Validators.required]),
    issueDate: new FormControl('', [Validators.required]),
    url: new FormControl(''),
    description: new FormControl('', [Validators.required])
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isPublicationsOpen() && !this.isOpen()) {
     const willOpen = !this.accordionService.isOpen(this.id)();
     this.toggle();
     if (willOpen) {
       this.loadPublicationInfo();
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
        this.loadPublicationInfo();
      }
  }

  resetForm(): void {
    this.publicationForm.reset({
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
      this.publicationForm.patchValue({ issueDate: diffDays.toString() });
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
    this.isLoading.set(true)
    if (this.accomPlishmentId !== null) {
      const request: DeleteAccomplishmentRequest = {
        acmId: this.accomPlishmentId,
        userGuid:  this.userGuidId ?? ""
      };

      this.accompolishmentService.deleteInfo(request).subscribe({
        next: (response) => {
          const errorEvent = response.find(r => r.eventType === 2);
          if (errorEvent) {
            const errorMessage = errorEvent.eventData.find(d => d.key === 'message')?.value[0] || 'Delete failed';
            console.error('Delete error:', errorMessage);
            this.isLoading.set(false)
            return;
          }
          this.isLoading.set(false)
          this.publicationSummaries = this.publicationSummaries.filter(p => p.accomPlishmentId !== this.accomPlishmentId);

          if (this.editingSummary?.accomPlishmentId === this.accomPlishmentId) {
            this.closeForm();
          }

          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting publication:', error);
          this.isLoading.set(false)
        }
      });
    }
  }


  togglePublicationSummary() {
    this.isPublicationExpanded = !this.isPublicationExpanded;
    if (!this.isPublicationExpanded) {
      this.resetForm();
    }
  }

  addNewPublication() {
    this.showForm = true;
    this.editingSummary = null;
    this.resetForm();
    this.isPublicationExpanded = true;
  }

  editSummary(publication: AccomplishmentEventDataItem) {
    this.editingSummary = publication;
    this.showForm = true;
    this.isPublicationExpanded = true;

    this.publicationForm.patchValue({
      accomplishmentId: publication.accomPlishmentId,
      title: publication.title,
      issueDate: publication.issuedOn,
      url: publication.url,
      description: publication.description
    });
  }

  closePublicationForm(): void {
    this.isPublicationsNewFormOpen.set(false);
    this.editingSummary = null;
    this.publicationForm.reset();
    this.dateRangeString = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.calendarVisible = false;
    this.formSubmitted = false;
  }

  openAddPublicationForm(): void {
    this.isPublicationsNewFormOpen.set(true);
    this.editingSummary = null;
    this.publicationForm.reset();
    this.isPublicationExpanded = true;
    this.calendarVisible = false;
  }

  ngOnInit(): void {
    //this.loadPublicationInfo();
    this.descriptionControl.valueChanges.subscribe(value => {
      if (value) {
        const plainText = this.stripHtmlTags(value);
        this.descriptionCharCount.set(plainText.length);
      } else {
        this.descriptionCharCount.set(0);
      }
    });
  }

  loadPublicationInfo(): void {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || ''; // for development only
    this.userGuidId = rawGuid ? decodeURIComponent(rawGuid) : '';

    this.isLoading.set(true);

    const query: AccomplishmentInfoQuery = {
      UserGuid:  this.userGuidId ?? ""
    };
    this.accompolishmentService.getAccomplishmentInfo(query, 2).subscribe({
      next: (summaries) => {
        this.publicationSummaries = summaries;
        if (summaries && summaries.length > 0) {
          this.isInfoAvailable = true;
          this.summary = summaries[0];
          this.publicationForm.patchValue({
            title: this.summary.title,
            issueDate: this.summary.issuedOn,
            url: this.summary.url,
            description: this.summary.description
          });
        } else {
          this.isInfoAvailable = false;
          this.summary = null;
        }
         this.isLoading.set(false);
      },
      error: (error) => {
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

  savePublicationSummary() {
    this.isLoading.set(true);
    this.formSubmitted = true;
    Object.keys(this.publicationForm.controls).forEach(key => {
      const control = this.publicationForm.get(key);
      control?.markAsTouched();
    });

    const descriptionValue = this.descriptionControl.value;
    if (!descriptionValue || this.stripHtmlTags(descriptionValue).trim() === '') {
      this.descriptionControl.setErrors({ required: true });
      this.isLoading.set(false);
      return;
    }

    if (this.publicationForm.invalid) {
      this.isLoading.set(false);
      return;
    }

    const formValue = this.publicationForm.value;
    const command: AccomplishmentUpdateInsert = {
      userGuid:  this.userGuidId ?? "",
      type: 2, 
      title: formValue.title || '',
      url: formValue.url || '',
      description: this.stripHtmlTags(formValue.description || ''),
      issueDate: new Date().toISOString()
    };
    if (this.editingSummary) {
      command.id = this.editingSummary.accomPlishmentId;
    }

    this.accompolishmentService.insertUpdateInfo(command).subscribe({
      next: (response) => {
        const successMsg = response.some(
          (r: any) =>
            r.eventType === 1 &&
            r.eventData.some((d: any) => d.key === 'Message' && d.value.includes('successfully'))
        );

        if (successMsg) {
          if (this.editingSummary) {
            const idx = this.publicationSummaries.findIndex(s => s.accomPlishmentId === this.editingSummary?.accomPlishmentId);
            if (idx > -1) {
              this.publicationSummaries[idx] = {
                ...this.publicationSummaries[idx],
                title: command.title,
                issuedOn: command.issueDate,
                url: command.url,
                description: command.description
              };
            }
          } else {
            const newSummary: AccomplishmentEventDataItem = {
              accomPlishmentId: response[0]?.eventData?.[0]?.value?.[0]?.accomplishmentId || this.getNextId(),
              type: 2,
              title: command.title,
              url: command.url,
              description: command.description,
              issuedOn: command.issueDate
            };
            this.publicationSummaries.push(newSummary);
          }
          this.closePublicationForm();

          this.toaster.show('Publication saved successfully!', {
            iconClass: 'lucide-check-circle',
            imageUrl: 'images/check-circle.svg',
            borderColor: 'bg-[#079455]'
          });
        } else {
          console.error('Operation failed:', response);
          this.toaster.show('Publication save failed!', {
            iconClass: 'lucide-check-circle',
            imageUrl: 'images/x-circle.svg',
            borderColor: 'bg-[#D92D20]'
          });
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('API Error:', error);
        this.toaster.show('Publication save failed!', {
          iconClass: 'lucide-check-circle',
          imageUrl: 'images/x-circle.svg',
          borderColor: 'bg-[#D92D20]'
        });
        this.isLoading.set(false);
      }
    });
  }

  private getNextId(): number {
    return this.publicationSummaries.length > 0
      ? Math.max(...this.publicationSummaries.map(s => s.accomPlishmentId)) + 1
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
    return this.publicationForm.get('title') as FormControl;
  }
  get issueDateControl(): FormControl {
    return this.publicationForm.get('issueDate') as FormControl;
  }

  get urlControl(): FormControl {
    return this.publicationForm.get('url') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.publicationForm.get('description') as FormControl;
  }

  onAddPublicationClick()
  {
    this.resetForm();
    this.isPublicationsNewFormOpen.set(true);
    this.editingSummary = null; // Ensure we're in "add" mode, not "
  }

  showEditor = false;

  showPublicationForm() {
    this.showPublication = true;
    this.cdRef.detectChanges();
  }
  onStartDateChanged(date: Date | null): void {
    if (date) {
      this.publicationForm.patchValue({
        issueDate: date.toISOString()
      });
    }
  }
}

import { ChangeDetectorRef, Component, computed, ElementRef, EventEmitter, HostListener, inject, input, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { DateSingleDatePickerComponent } from '../../../../../shared/components/date-single-date-picker/date-single-date-picker.component';
import { TextEditorComponent } from '../../../../../shared/components/text-editor/text-editor.component';
import { AccordionMainBodyComponent } from '../../../../../shared/components/accordion-main-body/accordion-main-body.component';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';
import { NoDetailsSummaryComponent } from '../../academic/no-details-training-summary/no-details-training-summary.component';
import { AccomplishmentEventDataItem, AccomplishmentInfoQuery, AccomplishmentUpdateInsert, AccomplishmentType, AccomplishmentEvent, AccomplishmentEventData, DeleteAccomplishmentRequest } from '../model/accomplishment';
import { AccomplishmentService } from '../service/accomplishment.service';
import { NoDetailsComponent } from "../../../../../shared/components/no-details/no-details.component";
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { InputComponent } from "../../../../../shared/components/input/input.component";
import { ToasterService } from '../../../../../shared/services/toaster.service';
import { CookieService } from '../../../../../core/services/cookie/cookie.service';


@Component({
  selector: 'app-project',
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
    TranslocoModule,
    InputComponent
  ],
  providers: [provideTranslocoScope('editResumeAccomplishment')],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})

export class ProjectComponent implements OnChanges {
  private accordionService = inject(AccordionManagerService)
  private accompolishmentService = inject(AccomplishmentService)
  toaster = inject(ToasterService);

  isProjectsOpen = input(false);
  isProjectNewFormOpen = signal(false);
  isProjectEditFormOpen = signal(false);
  isDeleteModalOpen = signal(false);
  isLoading = signal(true);
  isInfoAvailable = false;
  formSubmitted = false;
  isProjectExpanded = false;
  showForm = false;
  calendarVisible = false;
  private id = "accomplishmentproject";
  editResumeControl = new FormControl('')
  private accomPlishmentId: number | null = null;
  summary: AccomplishmentEventDataItem | null = null;
  projectSummaries: AccomplishmentEventDataItem[] = [];
  editingSummary: AccomplishmentEventDataItem | null = null;
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  dateRangeString = '';
  jobForm!: FormGroup;
  maxLengthError = signal(false);
  showProject = false;
  
  @ViewChild('container', { static: true }) containerRef!: ElementRef;
  @ViewChild('textEditor') textEditor: any;
  @Output() contentChanged = new EventEmitter<string>();
  nextId = 2;

  descriptionCharCount = signal(0);
  readonly MAX_DESCRIPTION_LENGTH = 300;

  constructor(private _eref: ElementRef, private cdRef: ChangeDetectorRef,private cookieService: CookieService) { }

   projectForm = new FormGroup({
    accomplishmentId: new FormControl<number | null>(null),
    title: new FormControl('', [Validators.required]),
    issueDate:new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  })
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isProjectsOpen() && !this.isOpen()) {
      const willOpen = !this.accordionService.isOpen(this.id)();
      this.toggle();
      if (willOpen) {
        this.loadProjectInfo();
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
        this.loadProjectInfo();
      }
  }
  resetForm(): void {
    this.projectForm.reset({
    accomplishmentId: null,
    title: '',
    issueDate: '',
    url: '',
    description: ''
  }, { emitEvent: false });
  
  setTimeout(() => {
    Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.setErrors(null);
    });
  });
  
  this.editingSummary = null;
  this.dateRangeString = '';
  this.selectedStartDate = null;
  this.selectedEndDate = null;
  this.formSubmitted = false;
  this.descriptionCharCount.set(0);
  }

  closeForm(): void {
    this.resetForm();
    this.editingSummary = null;
    this.isProjectNewFormOpen.set(false);
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
      this.projectForm.patchValue({ issueDate: diffDays.toString() });
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
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || ''; // for development only
    const userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
    console.log('User GUID ID Photo Component:', userGuidId);

    if (this.accomPlishmentId !== null) {
      const request: DeleteAccomplishmentRequest = {
        acmId: this.accomPlishmentId,
        userGuid:  userGuidId ?? ""
      };

      this.accompolishmentService.deleteInfo(request).subscribe({
        next: (response) => {
          const errorEvent = response.find(r => r.eventType === 2);
          if (errorEvent) {
            const errorMessage = errorEvent.eventData.find(d => d.key === 'message')?.value[0] || 'Delete failed';
            console.error('Delete error:', errorMessage);
            return;
          }
          this.projectSummaries = this.projectSummaries.filter(p => p.accomPlishmentId !== this.accomPlishmentId);
          
          if (this.editingSummary?.accomPlishmentId === this.accomPlishmentId) {
            this.closeForm();
          }
          
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting project:', error);
        }
      });
    }
  }

  toggleProjectSummary() {
    this.isProjectExpanded = !this.isProjectExpanded;
    if (!this.isProjectExpanded) {
      this.resetForm();
    }
  }

  addNewProject() {
    this.showForm = true;
    this.editingSummary = null;
    this.resetForm();
    this.isProjectExpanded = true;
  }

  editSummary(project: AccomplishmentEventDataItem) {
    this.editingSummary = {...project};
    this.isProjectNewFormOpen.set(false);
    this.isProjectExpanded = true;

    this.projectForm.patchValue({
      accomplishmentId: project.accomPlishmentId,
      title: project.title,
      issueDate: project.issuedOn,
      url: project.url,
      description: project.description
    });
    this.cdRef.detectChanges(); 
  }

  closeProjectForm(): void {
    this.isProjectNewFormOpen.set(false);
    this.editingSummary = null;
    this.projectForm.reset();
    this.dateRangeString = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.calendarVisible = false;
    this.formSubmitted = false;
  }

  openAddProjectForm(): void {
    this.resetForm();
    this.isProjectNewFormOpen.set(true);
    this.editingSummary = null;
    this.isProjectExpanded = true;
    this.calendarVisible = false;
    this.formSubmitted = false;
  }

  ngOnInit(): void {
   // this.loadProjectInfo();
    this.descriptionControl.valueChanges.subscribe(value => {
      if (value) {
        const plainText = this.stripHtmlTags(value);
        this.descriptionCharCount.set(plainText.length);
      } else {
        this.descriptionCharCount.set(0);
      }
    });
  }

  loadProjectInfo(): void {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || ''; // for development only
    const userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
    console.log('User GUID ID Photo Component:', userGuidId);

    this.isLoading.set(true);
    const query: AccomplishmentInfoQuery = {
      UserGuid:  userGuidId ?? ""
    };

    this.accompolishmentService.getAccomplishmentInfo(query, 4).subscribe({
      next: (summaries) => {
        this.projectSummaries = summaries;
        if (summaries && summaries.length > 0) {
          this.isInfoAvailable = true;
          this.summary = summaries[0];
          this.projectForm.patchValue({
            title: this.summary.title,
            issueDate: this.summary.issuedOn,
            url: this.summary.url,
            description: this.summary.description
          });
        } else {
          console.log('No project summaries received from API');
          this.isInfoAvailable = false;
          this.summary = null;
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading project summaries:', error);
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

  saveProjectSummary() {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || ''; // for development only
    const userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
    console.log('User GUID ID Photo Component:', userGuidId);

    this.isLoading.set(true);
    this.formSubmitted = true;
      Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();
    });

    const descriptionValue = this.descriptionControl.value;
    if (!descriptionValue || this.stripHtmlTags(descriptionValue).trim() === '') {
      this.descriptionControl.setErrors({ required: true });
      this.isLoading.set(false);
      return;
    }

    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      this.isLoading.set(false);
      return;
    }

    const formValue = this.projectForm.value;
    const command: AccomplishmentUpdateInsert = {
      userGuid:  userGuidId ?? "",
      type: 4, // project type
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
        console.log('API Response:', response);
        const successMsg = response.some(
          (r: any) =>
            r.eventType === 1 &&
            r.eventData.some((d: any) => d.key === 'Message' && d.value.includes('successfully'))
        );

        if (successMsg) {
          // Update local state
          if (this.editingSummary) {
            const idx = this.projectSummaries.findIndex(s => s.accomPlishmentId === this.editingSummary?.accomPlishmentId);
            if (idx > -1) {
              this.projectSummaries[idx] = {
                ...this.projectSummaries[idx],
                title: command.title,
                issuedOn: command.issueDate,
                url: command.url,
                description: command.description
              };
            }
          } else {
            // Add new project
            const newSummary: AccomplishmentEventDataItem = {
              accomPlishmentId: response[0]?.eventData?.[0]?.value?.[0]?.accomplishmentId || this.getNextId(),
              type: 4,
              title: command.title,
              url: command.url,
              description: command.description,
              issuedOn: command.issueDate
            };
            this.projectSummaries.push(newSummary);
          }
          this.closeProjectForm();
          
          this.toaster.show('Project saved successfully!', {
            iconClass: 'lucide-check-circle',
            imageUrl: 'images/check-circle.svg',
            borderColor: 'bg-[#079455]'
          });
        } else {
          console.error('Operation failed:', response);
          this.toaster.show('Project save failed!', {
            iconClass: 'lucide-check-circle',
            imageUrl: 'images/x-circle.svg',
            borderColor: 'bg-[#D92D20]'
          });
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('API Error:', error);
        this.toaster.show('Project save failed!', {
          iconClass: 'lucide-check-circle',
          imageUrl: 'images/x-circle.svg',
          borderColor: 'bg-[#D92D20]'
        });
        this.isLoading.set(false);
      }
    });
  }

  private getNextId(): number {
    return this.projectSummaries.length > 0
      ? Math.max(...this.projectSummaries.map(s => s.accomPlishmentId)) + 1
      : 1;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if(!this.containerRef?.nativeElement) return;

    const target = event.target as HTMLElement;
    if(!this.containerRef.nativeElement.contains(target)) {
      this.calendarVisible = false;
    }
  }

  // Helper getters    
  get titleControl(): FormControl {
    return this.projectForm.get('title') as FormControl;
  }
  get issueDateControl(): FormControl{
    return this.projectForm.get('issueDate') as FormControl;
  }
    
  get urlControl(): FormControl {
    return this.projectForm.get('url') as FormControl;
  }
    
  get descriptionControl(): FormControl {
    return this.projectForm.get('description') as FormControl;
  }

  showEditor = false;

  showProjectForm() {
    this.showProject = true;
    this.cdRef.detectChanges();
  }
   onStartDateChanged(date: Date | null): void {
    if (date) {
      this.projectForm.patchValue({
        issueDate: date.toISOString()
      });
    }
  }
}

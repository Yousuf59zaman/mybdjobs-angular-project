import { ChangeDetectorRef, Component, computed, ElementRef, EventEmitter, HostListener, inject, input, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { TextEditorComponent } from '../../../../../shared/components/text-editor/text-editor.component';
import { AccordionMainBodyComponent } from '../../../../../shared/components/accordion-main-body/accordion-main-body.component';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';
import { AccomplishmentEventDataItem, AccomplishmentInfoQuery, AccomplishmentUpdateInsert, DeleteAccomplishmentRequest } from '../model/accomplishment';
import { AccomplishmentService } from '../service/accomplishment.service';
import { NoDetailsComponent } from "../../../../../shared/components/no-details/no-details.component";
import { InputComponent } from "../../../../../shared/components/input/input.component";
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { ToasterService } from '../../../../../shared/services/toaster.service';
import { CookieService } from '../../../../../core/services/cookie/cookie.service';


@Component({
  selector: 'app-portfolio',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TextEditorComponent,
    AccordionMainBodyComponent,
    NgClass,
    NoDetailsComponent,
    InputComponent,
    TranslocoModule
  ],
  providers: [provideTranslocoScope('editResumeAccomplishment')],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnChanges {
  private accordionService = inject(AccordionManagerService)
  private accompolishmentService = inject(AccomplishmentService)
  toaster = inject(ToasterService);

  isPortfolioOpen = input(false);
  isPortfolioNewFormOpen = signal(false);
  isPortfolioEditFormOpen = signal(false);
  isDeleteModalOpen = signal(false);
  maxLengthError = signal(false);
  isLoading = signal(true);
  isPortfolioExpanded = false;
  showForm = false;
  calendarVisible = false;
  isInfoAvailable = false;
  formSubmitted = false;
  private id = "accomplishmentportfolio";
  private accomPlishmentId: number | null = null;
  dateRangeString = '';
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  summary: AccomplishmentEventDataItem | null = null;
  portfolioSummaries: AccomplishmentEventDataItem[] = [];
  editingSummary: AccomplishmentEventDataItem | null = null;

  @ViewChild('container', { static: true }) containerRef!: ElementRef;
  showProfolio = false;

  @ViewChild('textEditor') textEditor: any;
  @Output() contentChanged = new EventEmitter<string>();

  nextId = 2;

  descriptionCharCount = signal(0);
  readonly MAX_DESCRIPTION_LENGTH = 300;

  constructor(private _eref: ElementRef, private cdRef: ChangeDetectorRef, private cookieService: CookieService) { }

  portfolioForm = new FormGroup({
    accomplishmentId: new FormControl<number | null>(null),
    title: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });

  resetForm(): void {
    this.portfolioForm.reset({
      accomplishmentId: null,
      title: '',
      url: '',
      description: ''
    }, { emitEvent: false });

    this.editingSummary = null;
    this.dateRangeString = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.formSubmitted = false;

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isPortfolioOpen() && !this.isOpen()) {
     const willOpen = !this.accordionService.isOpen(this.id)();
        this.toggle();
        if (willOpen) {
          this.loadPortfolioInfo();
        }
       }
  }

  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    this.accordionService.toggle(this.id);
  }
  closeForm(): void {
    this.resetForm();
    this.showForm = false;
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
          this.portfolioSummaries = this.portfolioSummaries.filter(p => p.accomPlishmentId !== this.accomPlishmentId);

          if (this.editingSummary?.accomPlishmentId === this.accomPlishmentId) {
            this.closeForm();
          }

          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting portfolio:', error);
        }
      });
    }
  }



  togglePortfolioSummary() {
    this.isPortfolioExpanded = !this.isPortfolioExpanded;
    if (!this.isPortfolioExpanded) {
      this.resetForm();
    }
  }

  addNewPortfolio() {
    this.showForm = true;
    this.editingSummary = null;
    this.resetForm();
    this.isPortfolioExpanded = true;
  }

  editSummary(portfolio: AccomplishmentEventDataItem) {
    this.editingSummary = portfolio;
    this.showForm = true;
    this.isPortfolioExpanded = true;

    this.portfolioForm.patchValue({
      accomplishmentId: portfolio.accomPlishmentId,
      title: portfolio.title,
      url: portfolio.url,
      description: portfolio.description
    });
  }

  closePortfolioForm(): void {
    this.isPortfolioNewFormOpen.set(false);
    this.editingSummary = null;
    this.portfolioForm.reset();
    this.dateRangeString = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.calendarVisible = false;
    this.formSubmitted = false;
  }

  openAddPortfolioForm(): void {
    this.isPortfolioNewFormOpen.set(true);
    this.editingSummary = null;
    this.portfolioForm.reset();
    this.isPortfolioExpanded = true;
    this.calendarVisible = false;
  }

  ngOnInit(): void {
    this.loadPortfolioInfo();
    // Subscribe to description changes
    this.descriptionControl.valueChanges.subscribe(value => {
      if (value) {
        const plainText = this.stripHtmlTags(value);
        this.descriptionCharCount.set(plainText.length);
      } else {
        this.descriptionCharCount.set(0);
      }
    });
  }

  loadPortfolioInfo(): void {
    this.isLoading.set(true);
    const query: AccomplishmentInfoQuery = {
      UserGuid: 'ZRDhZ7YxZEYyITPbBQ00PFPiMTDhBTUyPRmbPxdxYiObIFZ9BFPtBFVUIGL3Ung='
    };

    // const rawGuid = this.cookieService.getCookie('MybdjobsGId') || 'ZiZuPid0ZRLyZ7S3YQ00PRg7MRgwPELyBTYxPRLzZESuYTU0BFPtBFVUIGL3Ung%3D'; // for development only
    // this.userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
    // console.log('User GUID ID Photo Component:', this.userGuidId);

    this.accompolishmentService.getAccomplishmentInfo(query, 1).subscribe({
      next: (summaries) => {
        this.portfolioSummaries = summaries;
        if (summaries && summaries.length > 0) {
          this.isInfoAvailable = true;
          this.summary = summaries[0];
          this.portfolioForm.patchValue({
            title: this.summary.title,
            url: this.summary.url,
            description: this.summary.description
          });
        } else {
          console.log('No portfolio summaries received from API');
          this.isInfoAvailable = false;
          this.summary = null;
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading portfolio summaries:', error);
        this.isInfoAvailable = false;
        this.summary = null;
        this.isLoading.set(false);
      }
    });
  }

  private stripHtmlTags(html: string): string {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  savePortfolioSummary() {
    this.isLoading.set(true);
    this.formSubmitted = true;
    if (this.portfolioForm.invalid) {
      this.portfolioForm.markAllAsTouched();
      return;
    }

    const formValue = this.portfolioForm.value;
    const command: AccomplishmentUpdateInsert = {
      userGuid: 'ZRDhZ7YxZEYyITPbBQ00PFPiMTDhBTUyPRmbPxdxYiObIFZ9BFPtBFVUIGL3Ung=',
      type: 1, // portfolio type
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
            // Update existing portfolio
            const idx = this.portfolioSummaries.findIndex(s => s.accomPlishmentId === this.editingSummary?.accomPlishmentId);
            if (idx > -1) {
              this.portfolioSummaries[idx] = {
                ...this.portfolioSummaries[idx],
                title: command.title,
                url: command.url,
                description: command.description
              };
            }
          } else {
            // Add new portfolio
            const newSummary: AccomplishmentEventDataItem = {
              accomPlishmentId: response[0]?.eventData?.[0]?.value?.[0]?.accomplishmentId || this.getNextId(),
              type: 1,
              title: command.title,
              url: command.url,
              description: command.description,
              issuedOn: command.issueDate
            };
            this.portfolioSummaries.push(newSummary);
          }
          this.closePortfolioForm();

          this.toaster.show('Portfolio saved successfully!', {
            iconClass: 'lucide-check-circle',
            imageUrl: 'images/check-circle.svg',
            borderColor: 'bg-[#079455]'
          });
        } else {
          console.error('Operation failed:', response);
          this.toaster.show('Portfolio save failed!', {
            iconClass: 'lucide-check-circle',
            imageUrl: 'images/x-circle.svg',
            borderColor: 'bg-[#D92D20]'
          });
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('API Error:', error);
        this.toaster.show('Portfolio save failed!', {
          iconClass: 'lucide-check-circle',
          imageUrl: 'images/x-circle.svg',
          borderColor: 'bg-[#D92D20]'
        });
        this.isLoading.set(false);
      }
    });
  }

  private getNextId(): number {
    return this.portfolioSummaries.length > 0
      ? Math.max(...this.portfolioSummaries.map(s => s.accomPlishmentId)) + 1
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
    return this.portfolioForm.get('title') as FormControl;
  }

  get urlControl(): FormControl {
    return this.portfolioForm.get('url') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.portfolioForm.get('description') as FormControl;
  }

  showEditor = false;

  showPorfolioForm() {
    this.showProfolio = true;
    this.cdRef.detectChanges();
  }
}

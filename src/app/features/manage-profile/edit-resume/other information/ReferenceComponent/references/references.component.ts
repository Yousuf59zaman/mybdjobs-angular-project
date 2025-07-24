import {
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  input,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectboxComponent } from '../../../../../../shared/components/selectbox/selectbox.component';
import { DateRangePickerComponent } from '../../../../../../shared/components/date-range-picker/date-range-picker.component';
import { AccordionMainBodyComponent } from '../../../../../../shared/components/accordion-main-body/accordion-main-body.component';
import { AccordionManagerService } from '../../../../../../shared/services/accordion.service';
import { TrainingSummary } from '../../../../../../shared/models/models';
import { NoDetailsSummaryComponent } from '../../../academic/no-details-training-summary/no-details-training-summary.component';
import { TextEditorComponent } from '../../../../../../shared/components/text-editor/text-editor.component';
import { ReferencesService } from '../services/references.service';
import {
  DeleteReferencePayload,
  EventResponse,
  InsertReferencePayload,
  UpdateReferencePayload,
} from '../models/referenceModel';
import { ReferenceModel } from '../models/referenceModel';
import { finalize } from 'rxjs';
import { NoDetailsComponent } from '../../../../../../shared/components/no-details/no-details.component';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { CookieService } from '../../../../../../core/services/cookie/cookie.service';
@Component({
  selector: 'app-references',
  imports: [
    SelectboxComponent,
    DateRangePickerComponent,
    NoDetailsSummaryComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TextEditorComponent,
    AccordionMainBodyComponent,
    NoDetailsComponent,
    TranslocoModule,
  ],
  templateUrl: './references.component.html',
  styleUrl: './references.component.scss',
  providers: [provideTranslocoScope('reference')],
})
export class ReferencesComponent {
  private accordionService = inject(AccordionManagerService);
  private cookieService = inject(CookieService);
  isReferencesOpen = input(false);
  isReferencesNewFormOpen = signal(false);
  shouldOpen = signal(true);
  referenceCount = signal(0);
  isReferencesEditFormOpen = signal(false);
  isLoading = signal(true);
  isInfoAvalable = signal(false);
  formIsOpen = signal(false);
  isSaving = false;
  private id = 'referencesinfo';

  isAcademicSummaryExpanded = false;
  showForm = false;
  calendarVisible = false;
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  dateRangeString = '';
  @ViewChild('container', { static: true }) containerRef!: ElementRef;
  // Add this property
  showTraining2 = false;
  referenceService = inject(ReferencesService);
  referenceCheckingId: number | null = 0;
  //guid cookies here
  rawGuid = this.cookieService.getCookie('MybdjobsGId')
  #userGuid = 'ZRDhZ7YxZEYyITPbBQ00PFPiMTDhBTUyPRmbPxdxYiObIFZ9BFPtBFVUIGL3Ung=';
  userGuid = decodeURIComponent(this.rawGuid || '');
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isReferencesOpen() && !this.isOpen()) {
      const willOpen = !this.accordionService.isOpen(this.id)();
      this.toggle();
      if (willOpen) {
        this.loadReference(this.userGuid);
      }
    }
  }
  ngOnInit() {}
  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    this.accordionService.toggle(this.id);
    if (this.referenceData.length == 0) {
      this.isInfoAvalable.set(false);
    }
  }

  editingSummary: ReferenceModel | null = null;
  nextId = 2; // Start from 2 since we have one example

  constructor(private _eref: ElementRef, private cdRef: ChangeDetectorRef) {}

  // Form setup with validation
  referenceForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    designation: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    organization: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    email: new FormControl(''),
    relation: new FormControl(''),
    mobile: new FormControl(''),
    officialPhoneNo: new FormControl(''),
    residentalPhoneNo: new FormControl(''),
    address: new FormControl(''),
  });

  relationControl = computed(
    () => this.referenceForm.get('relation') as FormControl<string>
  );

  addressControl = computed(
    () => this.referenceForm.get('address') as FormControl<string>
  );

  // Dropdown options
  relation = signal([
    { label: 'Relative', value: 'Relative' },
    { label: 'Family Friend', value: 'Family Friend' },
    { label: 'Academic', value: 'Academic' },
    { label: 'Professional', value: 'Professional' },
    { label: 'Others', value: 'Others' },
  ]);

  // Toggle sections
  toggleAcademicSummary() {
    this.isAcademicSummaryExpanded = !this.isAcademicSummaryExpanded;
    if (!this.isAcademicSummaryExpanded) {
      this.resetForm();
    }
  }

  referenceData: ReferenceModel[] = [];
  loadReference(userGuid: string): void {
    this.referenceService
      .getReference(userGuid)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (response: EventResponse) => {
          if (response.event.eventData && response.event.eventData.length > 0) {
            const eventType = response.event.eventType;
            if (eventType == 1) {
              const referenceResponse = response.event.eventData.find(
                (data) => data.key === 'message'
              );
              if (referenceResponse) {
                this.referenceData = referenceResponse.value;
                // Update reference count based on your actual data structure
                this.referenceCount.set(this.referenceData.length);
              }          
              this.isInfoAvalable.set(true);
            } else {
              this.isInfoAvalable.set(false);
              this.referenceCount.set(0);
            }
          }
        },
      });
  }
  editReferenceData: any = null;
  editReference(reference: any) {
    this.referenceCheckingId = reference.referenceId;
    this.editReferenceData = this.referenceData;
    this.isReferencesEditFormOpen.set(true);
    this.bindForm(reference);
  }
  bindForm(reference: ReferenceModel): void {
    this.referenceForm.patchValue({
      name: reference.name,
      designation: reference.designation,
      organization: reference.organization,
      email: reference.email,
      relation: reference.relation,
      mobile: reference.mobile,
      officialPhoneNo: reference.officialPhoneNo,
      residentalPhoneNo: reference.residentalPhoneNo,
      address: reference.address,
    });
  }

  saveTrainingSummary() {
    if (this.isSaving) return;
    const requiredFields = ['name', 'designation', 'organization'];
    requiredFields.forEach((field) => {
      this.referenceForm.get(field)?.markAsTouched();
    });

    const isRequiredFieldsValid = requiredFields.every(
      (field) => this.referenceForm.get(field)?.valid
    );

    if (!isRequiredFieldsValid) {
      console.log('Validation failed for required fields');
      return;
    }

    this.isSaving = true;
    const addressValue = this.addressControl().value;
    const addressHtml = addressValue
      ? this.prosemirrorToHtml(addressValue)
      : null;
    console.log('thsi is is is ', addressHtml);

    const payload: UpdateReferencePayload = {
      r_ID: this.referenceCheckingId || 0,
      userGuid: this.userGuid,
      referenceName: this.referenceForm.value.name!,
      designation: this.referenceForm.value.designation!,
      organization: this.referenceForm.value.organization!,
      address: addressHtml,
      phoneOffice: this.referenceForm.value.officialPhoneNo || null,
      phoneHome: this.referenceForm.value.residentalPhoneNo || null,
      mobile: this.referenceForm.value.mobile || null,
      email: this.referenceForm.value.email || null,
      relation: this.referenceForm.value.relation || null,
    };

    this.referenceService
      .updateReference(payload)
      .pipe()
      .subscribe({
        next: () => {
          this.handleSaveSuccess();
          this.isSaving = false; // Reset flag on success
        },
        error: (err) => {
          this.handleSaveError(err);
          this.isSaving = false; // Reset flag on error
        },
      });
  }

  private prosemirrorToHtml(json: any): string {
    if (!json || !json.content) return '';

    let html = '';

    for (const node of json.content) {
      if (node.type === 'paragraph') {
        let paragraphHtml = '';

        if (node.content) {
          for (const contentNode of node.content) {
            if (contentNode.type === 'text') {
              let text = contentNode.text;

              if (contentNode.marks) {
                for (const mark of contentNode.marks) {
                  if (mark.type === 'strong') {
                    text = `<strong>${text}</strong>`;
                  } else if (mark.type === 'em') {
                    text = `<em>${text}</em>`;
                  }
                  // Add other mark types as needed (underline, links, etc.)
                }
              }

              paragraphHtml += text;
            }
          }
        }

        html += `<p>${paragraphHtml}</p>`;
      }
      // Add other node types as needed (headings, lists, etc.)
    }

    return html;
  }
  private handleSaveSuccess() {
    this.closeForm();
    this.loadReference(this.userGuid);
    // Optional: Show success toast/message
  }

  private handleSaveError(error: any) {
    console.error('Save error:', error);
    // Optional: Show error toast/message
  }

  // Add new reference
  addNewReference() {
    if (this.isSaving) return;
    this.referenceForm.markAllAsTouched();
    console.log('reference form values are ', this.referenceForm.value);
    if (this.referenceForm.invalid) {
      console.log('form is invalid of reference');
      return;
    }
    this.referenceCheckingId = null;
    this.isReferencesEditFormOpen.set(true);
    const addressValue = this.referenceForm.value;
    const addressHtml = addressValue
      ? this.prosemirrorToHtml(addressValue)
      : null;
    const payload: InsertReferencePayload = {
      userGuid: this.userGuid,
      name: this.referenceForm.value.name!,
      designation: this.referenceForm.value.designation!,
      organization: this.referenceForm.value.organization!,
      email: this.referenceForm.value.email || null,
      relation: this.referenceForm.value.relation || null,
      mobile: this.referenceForm.value.mobile || null,
      phone_Office: this.referenceForm.value.officialPhoneNo || null,
      phone_Home: this.referenceForm.value.residentalPhoneNo || null,
      address: this.referenceForm.value.address,
    };
    this.isSaving = true;
    this.referenceService.insertReference(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.handleSaveSuccess();
      },
      error: (err) => {
        this.handleSaveError(err);
        this.isSaving = false;
      },
    });
    this.referenceForm.reset();
  }

  deleteSummary(id: number) {}

  resetForm() {
    this.referenceForm.reset();
    this.isReferencesNewFormOpen.set(false);
    this.formIsOpen.set(false);
    this.editingSummary = null;
    this.dateRangeString = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
  }

  closeForm() {
    this.resetForm();
    this.showForm = false;
    this.isReferencesEditFormOpen.set(false);
    this.referenceCheckingId = null;
  }

  // Date picker functionality
  toggleCalendar() {
    this.calendarVisible = !this.calendarVisible;
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

  showEditor = false;

  showTraining2Form() {
    this.showTraining2 = true;
    this.cdRef.detectChanges(); // Force change detection
  }
  openArmyData() {
    this.isReferencesNewFormOpen.set(true);
    this.isInfoAvalable.set(true);
    this.referenceForm.reset();
    this.formIsOpen.set(true);
  }

  pendingDeleteId = signal<number | null>(null);
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
    if (this.isSaving) return;
    if (id === null) return;
    console.log('I am clicked', id);

    const userGuid =
      'ZRDhZ7YxZEYyITPbBQ00PFPiMTDhBTUyPRmbPxdxYiObIFZ9BFPtBFVUIGL3Ung=';
    this.isSaving = true;
    this.referenceService.deleteReference(userGuid, id).subscribe({
      next: (res) => {
        // reload your list
        this.loadReference(this.userGuid);
        // now that it's done, close the modal
        this.closeDeleteModal();
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Delete failed', err);
        // optionally show a toast or keep the dialog open
      },
    });
  }

  onExpandClick() {
    const willOpen = !this.accordionService.isOpen(this.id)();
    this.toggle(); // toggles the accordion

    if (willOpen) {
      this.loadReference(this.userGuid);
    }
  }
}

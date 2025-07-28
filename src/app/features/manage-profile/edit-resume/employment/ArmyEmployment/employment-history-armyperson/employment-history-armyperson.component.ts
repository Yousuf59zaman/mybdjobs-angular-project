import {
  ChangeDetectorRef,
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { InputComponent } from '../../../../../../shared/components/input/input.component';
import { SelectboxComponent } from '../../../../../../shared/components/selectbox/selectbox.component';
import { DateSingleDatePickerComponent } from '../../../../../../shared/components/date-single-date-picker/date-single-date-picker.component';
import { AccordionMainBodyComponent } from '../../../../../../shared/components/accordion-main-body/accordion-main-body.component';
import { AccordionManagerService } from '../../../../../../shared/services/accordion.service';
import { NoDetailsSummaryComponent } from '../../../academic/no-details-training-summary/no-details-training-summary.component';
import { selectBoxItem } from '../../../../../../shared/models/models';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { EmploymentArmyService } from '../services/employment-army.service';
import { finalize, of, single } from 'rxjs';
import {
  ArmyHistoryItem,
  PostArmyDetails,
} from '../models/armyEmploymentModel';
import { NoDetailsComponent } from '../../../../../../shared/components/no-details/no-details.component';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { CookieService } from '../../../../../../core/services/cookie/cookie.service';

@Component({
  selector: 'app-employment-history-armyperson',
  imports: [
    // NoDetailsSummaryComponent,
    InputComponent,
    SelectboxComponent,
    DateSingleDatePickerComponent,
    NgClass,
    AccordionMainBodyComponent,
    DatePipe,
    ReactiveFormsModule,
    CommonModule,
    NoDetailsComponent,
    TranslocoModule
  ],
  templateUrl: './employment-history-armyperson.component.html',
  styleUrl: './employment-history-armyperson.component.scss',
  providers: [provideTranslocoScope('armyEmployment')]
})
export class EmploymentHistoryArmypersonComponent {
  employmentService = inject(EmploymentArmyService);
  private cookieService = inject(CookieService);
  isEmploymentArmyHistoryOpen = input(false);
  isEmploymentArmyHistoryEditFormOpen = signal(false);
  isEmploymentArmyHistoryNewFormOpen = signal(false);
  isLoading = signal(true);
  isInfoAvailable = signal(false);
  formIsOpen = signal(false);
  isSubmitting = signal(false);
  private id = 'employmentarmyhistory';

  private accordionService = inject(AccordionManagerService);
    ngOnChanges(changes: SimpleChanges): void {
    if(this.isEmploymentArmyHistoryOpen() && !this.isOpen()) {
      const willOpen = !this.accordionService.isOpen(this.id)();
      this.toggle();
      if (willOpen) {
        this.loadArmyData()
      }
    }
  }

  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    this.accordionService.toggle(this.id);
  }

  // isAcademicSummaryExpanded = false;
  @Output() onClose = new EventEmitter<void>();
  isExpanded = false;
  @Output() addExperience = new EventEmitter<void>();
  placeholderText: string = 'Select your BA no';
  private resizeObserver!: ResizeObserver;
  constructor(private cd: ChangeDetectorRef) {}
 //guid cookies here

  userGuid = '';

  ngOnInit() {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId');  //uncomment this line before testing/live
    this.userGuid = rawGuid ? decodeURIComponent(rawGuid) : "";
    this.updatePlaceholder();
    this.resizeObserver = new ResizeObserver(() => {
      this.updatePlaceholder();
      this.cd.detectChanges();
    });
    this.resizeObserver.observe(document.body);
  }
  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  updatePlaceholder() {
    this.placeholderText =
      window.innerWidth < 1024 ? 'Select' : 'Select your BA no';
  }

  toggleDropdown() {
    this.isExpanded = !this.isExpanded;
  }

  handleAddExperience() {
    this.addExperience.emit();
  }

  //  toggleAcademicSummary() {
  //     this.isAcademicSummaryExpanded = !this.isAcademicSummaryExpanded;
  //   }

  closeForm() {
    this.onClose.emit();
  }

  onStartDateChanged(date: Date | null): void {
    this.DateOfCommissionControl().setValue(date);
  }
  onEndDateChanged(date: Date | null): void {
    this.DateOfRetirementControl().setValue(date);
  }

  employmentArmyForm = new FormGroup(
    {
      baNo: new FormControl('', Validators.required),
      baNumeric: new FormControl<number | null>(null, [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.minLength(1),
        Validators.maxLength(9),
      ]),
      ranks: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      arms: new FormControl('', Validators.required),
      trade: new FormControl<string | null>(null),
      course: new FormControl(''),
      dateOfCommission: new FormControl<Date | null>(null, Validators.required),
      dateOfRetirement: new FormControl<Date | null>(null, Validators.required),
    },
    { validators: this.dateComparisonValidator.bind(this) }
  );

  baNumberControl = computed(
    () => this.employmentArmyForm.get('baNo') as FormControl<string>
  );
  baNumericControl = computed(
    () => this.employmentArmyForm.get('baNumeric') as FormControl
  );

  RanksControl = computed(
    () => this.employmentArmyForm.get('ranks') as FormControl<string>
  );

  TypeOfArmyControl = computed(
    () => this.employmentArmyForm.get('type') as FormControl<string>
  );

  ArmsControl = computed(
    () => this.employmentArmyForm.get('arms') as FormControl<string>
  );
  TradeControl = computed(
    () => this.employmentArmyForm.get('trade') as FormControl
  );
  CourseControl = computed(
    () => this.employmentArmyForm.get('course') as FormControl<string>
  );
  DateOfCommissionControl = computed(
    () => this.employmentArmyForm.get('dateOfCommission') as FormControl
  );

  DateOfRetirementControl = computed(
    () => this.employmentArmyForm.get('dateOfRetirement') as FormControl
  );
  BaNumber: selectBoxItem[] = [
    { label: 'BA', value: 'BA' },
    { label: 'BSS', value: 'BSS' },
    { label: 'JS', value: 'JS' },
    { label: 'BSP', value: 'BSP' },
    { label: 'BJO', value: 'BJO' },
    { label: 'No', value: 'No' },
  ];
  Ranks: selectBoxItem[] = [
    { label: 'Lt', value: 'Lt' },
    { label: 'Capt', value: 'Capt' },
    { label: 'Maj', value: 'Maj' },
    { label: '2Lt', value: '2Lt' },
    { label: 'Lt Col', value: 'Lt Col' },
    { label: 'Col', value: 'Col' },
    { label: 'Brig Gen', value: 'Brig Gen' },
    { label: 'Maj Gen', value: 'Maj Gen' },
    { label: 'Lt Gen', value: 'Lt Gen' },
    { label: 'Gen', value: 'Gen' },
    { label: 'Snk', value: 'Snk' },
    { label: 'L/cpl', value: 'L/cpl' },
    { label: 'Cpl', value: 'Cpl' },
    { label: 'Sgt', value: 'Sgt' },
    { label: 'WO', value: 'WO' },
    { label: 'SWO', value: 'SWO' },
    { label: 'MWO', value: 'MWO' },
    { label: 'H/Lt', value: 'H/Lt' },
    { label: 'H/Capt', value: 'H/Capt' },
  ];
  TypeOfArmy: selectBoxItem[] = [
    { label: 'Officer', value: 'Officer' },
    { label: 'JCO', value: 'JCO' },
    { label: 'NCO', value: 'NCO' },
  ];

  Arms: selectBoxItem[] = [
    { label: 'AC', value: 'AC' },
    { label: 'Arty', value: 'Arty' },
    { label: 'EB', value: 'EB' },
    { label: 'BIR', value: 'BIR' },
    { label: 'Sigs', value: 'Sigs' },
    { label: 'Engr', value: 'Engr' },
    { label: 'EME', value: 'EME' },
    { label: 'Ord', value: 'Ord' },
    { label: 'ASC', value: 'ASC' },
    { label: 'AMC', value: 'AMC' },
    { label: 'AEC', value: 'AEC' },
    { label: 'CMP', value: 'CMP' },
    { label: 'ADC', value: 'ADC' },
    { label: 'AFNS', value: 'AFNS' },
    { label: 'RVFC', value: 'RVFC' },
    { label: 'ACC', value: 'ACC' },
  ];

  error: string | null = null;
  armyData: ArmyHistoryItem[] = [];
  currentData: ArmyHistoryItem[] = [];

  loadArmyData(): void {
    this.employmentService
      .getRetiredArmyMessages(this.userGuid)
      .pipe(
        finalize(() => {
          // always clear the loading flag when complete (success or error)
          this.isLoading.set(false);
        })
      )
      .subscribe((response) => {
        if (!response) return;

        try {
          const messageEvent = response.event.eventData.find(
            (item: any) => item.key === 'message'
          );

          if (messageEvent?.value) {
            this.armyData = messageEvent.value as ArmyHistoryItem[]; // Cast to proper type
            this.currentData = this.armyData;
            if (this.currentData.length == 38) {
              this.formIsOpen.set(true)
              this.isInfoAvailable.set(false)
            }
            if (this.currentData.length == 1) {
              this.formIsOpen.set(true);
              this.isInfoAvailable.set(true);
            }
            this.bindData();
          } else {
            this.isInfoAvailable.set(false);
          }
        } catch (e) {
        }
      });
  }

  bindData(): void {
    if (!this.currentData) {
      return;
    }
    // baNumberControl is a computed() that returns the FormControl<string>
    this.baNumberControl().setValue(
      this.currentData[0].bA_No?.toString() ?? ''
    );
    this.baNumericControl().setValue(this.currentData[0].bA_Number);
    this.RanksControl().setValue(this.currentData[0].rank ?? '');
    this.TypeOfArmyControl().setValue(this.currentData[0].type ?? '');
    this.ArmsControl().setValue(this.currentData[0].arms ?? '');
    this.TradeControl().setValue(this.currentData[0].trade ?? '');
    this.CourseControl().setValue(this.currentData[0].course ?? '');

    // If your incoming dates are strings, convert them to Date
    const comDate = this.currentData[0].dateOfCommision
      ? this.formatToDisplay(this.currentData[0].dateOfCommision)
      : null;
    const retDate = this.currentData[0]?.dateOfRetirement
      ? this.formatToDisplay(this.currentData[0].dateOfRetirement)
      : null;
    this.DateOfCommissionControl().setValue(comDate);
    this.DateOfRetirementControl().setValue(retDate);
  }

  checkValidation(data: any): void {
    const baNumericValue = this.employmentArmyForm.value.baNumeric!; // Assert non-null
    const baValue = baNumericValue.toString();
    const ranksValue = this.employmentArmyForm.value.ranks!;
    const typeValue = this.employmentArmyForm.value.type!;
    const armsValue = this.employmentArmyForm.value.type!;
    const startingDate = this.employmentArmyForm.value.dateOfCommission!;
    const endingDate = this.employmentArmyForm.value.dateOfRetirement!;
    if (baValue === '' || baValue.length > 9) {
      const baNumericControl = this.employmentArmyForm.controls['baNumeric'];
      const value = baNumericControl.value?.toString();
      // Reset errors first
      baNumericControl.setErrors(null);
      // Check for empty/null (required)
      if (value === null || value === undefined || value == '') {
        baNumericControl.setErrors({ required: true });
        return;
      }

      // Check max length (9 digits)
      if (value.toString().length > 9) {
        baNumericControl.setErrors({
          maxlength: {
            requiredLength: 9,
            actualLength: value.toString().length,
          },
        });
        return;
      }

      // If all valid, mark as valid
      baNumericControl.setErrors(null);
    }
    if (ranksValue == null || ranksValue == undefined || ranksValue == '') {
      this.employmentArmyForm.controls['ranks'].setErrors({ required: true });
    }
    if (typeValue == null || typeValue == undefined || typeValue == '') {
      this.employmentArmyForm.controls['type'].setErrors({ required: true });
    }
    if (armsValue == null || armsValue == undefined || armsValue == '') {
      this.employmentArmyForm.controls['arms'].setErrors({ required: true });
    }
    const start = new Date(startingDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endingDate);
    end.setHours(0, 0, 0, 0);

    if (end <= start) {
      this.employmentArmyForm.controls['dateOfRetirement'].setErrors({
        required: true,
      });
    }
  }

  onSubmit() {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.employmentArmyForm.markAllAsTouched();
    this.checkValidation(this.employmentArmyForm);
    if (this.employmentArmyForm.valid) {
      const formValue = this.employmentArmyForm.value;
      const payload: PostArmyDetails = {
        bA_No: formValue.baNo || '',
        bA_Number: formValue.baNumeric ?? 0,
        rank: formValue.ranks || '',
        type: formValue.type || '',
        arms: formValue.arms || '',
        trade: formValue.trade || '', // Ensure empty becomes null
        course: formValue.course || '',
        dateOfCommision: this.formatToBackend(
          this.DateOfCommissionControl().value!
        ),
        dateOfRetirement: this.formatToBackend(
          this.DateOfRetirementControl().value!
        ),
        retiredArmyId: this.currentData[0].retiredArmyId || '',
        userGuidId:this.userGuid,
        version: 'en',
      };
      this.employmentService.postRetiredArmy(payload).subscribe({
        next: (response) => {
          this.loadArmyData();
          this.isSubmitting.set(false);
          this.isEmploymentArmyHistoryEditFormOpen.set(false);
        },
        error: (err) => {
        },
      });
    } else {
      this.isSubmitting.set(false);
    }
  }

  private dateComparisonValidator(
    formGroup: AbstractControl
  ): ValidationErrors | null {
    const group = formGroup as FormGroup;
    const commissionDate = group.get('dateOfCommission')?.value;
    const retirementDate = group.get('dateOfRetirement')?.value;
    if (!commissionDate || !retirementDate) return null;

    const commDate = new Date(commissionDate);
    const retDate = new Date(retirementDate);

    // Clear time portions for accurate date comparison
    commDate.setHours(0, 0, 0, 0);
    retDate.setHours(0, 0, 0, 0);

    return retDate < commDate ? { retirementBeforeCommission: true } : null;
  }

  formatToDisplay(
    input: Date | string | number | null | undefined
  ): string | null {
    if (!input) return null;

    const date = new Date(input);
    return isNaN(date.getTime())
      ? null
      : date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
  }

  formatToBackend(input: Date | string | number): string {
    const date = new Date(input);

    const pad2 = (n: number) => n.toString().padStart(2, '0');

    const yyyy = date.getFullYear();
    const MM = pad2(date.getMonth() + 1);
    const dd = pad2(date.getDate());
    const HH = pad2(date.getHours());
    const mm = pad2(date.getMinutes());
    const ss = pad2(date.getSeconds());

    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
  }

  openCertificationData() {
    this.formIsOpen.set(true);
    this.isEmploymentArmyHistoryEditFormOpen.set(true);
    this.isInfoAvailable.set(true)
    this.employmentArmyForm.reset()
  }
  isDeleteModalOpen = signal(false);
  openDeleteModal() {
    this.isDeleteModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeDeleteModal() {
    this.isDeleteModalOpen.set(false);
    document.body.style.overflow = '';
  }
  confirmDelete() {
    this.employmentService.deleteRetiredArmy(this.userGuid).subscribe({
      next: (response) => {
        if (response.length > 0) {
          const apiResponse = response[0];
          if (apiResponse.eventType == 1) {
            this.loadArmyData();
            this.isEmploymentArmyHistoryEditFormOpen.set(false);
            this.isInfoAvailable.set(false);
            this.closeDeleteModal();
          }
        }
      },
      error: (err) => {
      },
    });
  }
  onExpandClick() {
    const willOpen = !this.accordionService.isOpen(this.id)();
    this.toggle(); // toggles the accordion

    if (willOpen) {
      this.loadArmyData()
    }
  }
}

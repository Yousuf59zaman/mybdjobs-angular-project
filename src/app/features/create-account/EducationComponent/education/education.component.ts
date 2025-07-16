import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Education,
  EducationPost,
  GetBoardNameResponse,
  GetDegreeNameResponse,
  GetEduLevelInfoResponse,
  Institute,
  InstituteSearchPayload,
  SelectItem,
} from './models/education';
import {
  provideTranslocoScope,
  TranslocoModule,
  TranslocoService,
} from '@jsverse/transloco';

import { CommonModule } from '@angular/common';
import { EducationService } from '../service/education.service';
import { debounceTime, distinctUntilChanged, filter, skip } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateAccountService } from '../../create-account/services/create-account.service';
import { CookieService } from '../../../../core/services/cookie/cookie.service';
import { RadioComponent } from '../../../../shared/components/radio/radio.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [
    RadioComponent,
    SelectComponent,
    InputComponent,
    TranslocoModule,
    CommonModule,
  ],
  providers: [provideTranslocoScope('education')],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
})
export class EducationComponent implements OnInit {
  private createAccountService = inject(CreateAccountService);
  private route = inject(ActivatedRoute);
  private educationService = inject(EducationService);
  private router = inject(Router);
  private cookieService = inject(CookieService);

  email: string = 'support@bdjobs.com';
  isDisabled = signal<boolean>(false);
  isSelectingInstitute: boolean = false;
  EducationForm = new FormGroup({
    GuidId: new FormControl<string | null>(null, [Validators.required]),
    HasEducation: new FormControl<number | null>(1),
    EducationLevel: new FormControl<number | null>(1, [Validators.required]),
    InstituteName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    PassingYear: new FormControl<number | null>(null, [Validators.required]),
    ExamTitle: new FormControl<string | null>(null, [Validators.required]),
    BoardId: new FormControl<number | null>(null),
    MajorGroup: new FormControl<string | null>(null, [
      Validators.maxLength(150),
    ]),
    EducationType: new FormControl<number | null>(0, [Validators.required]),
  });
  constructor(private translocoService: TranslocoService) {}
  currentLanguage = 'en';
  isBlueCollar = false;
  isDisability = false;
  educationRadioItem = [
    { id: 1, name: 'HasEducation', label: 'Yes' },
    { id: 0, name: 'HasEducation', label: 'No' },
  ];

  hasEducationControl = computed(
    () => this.EducationForm.get('HasEducation') as FormControl
  );

  educationOptions = signal<SelectItem[]>([]);
  examTitleOptions = signal<SelectItem[]>([]);
  boardOptions = signal<SelectItem[]>([]);
  yearListOptions = signal<SelectItem[]>([]);
  instituteSuggestions = signal<Institute[]>([]);
  guid: string = '';

  generateYearList(): void {
    const startYear = 2030;
    const endYear = 1970;

    for (let year = startYear; year >= endYear; year--) {
      this.yearListOptions().push({
        label: year.toString(),
        value: year.toString(),
      });
    }
  }
  additionalListControl = computed(
    () => this.EducationForm.get('EducationLevel') as FormControl
  );
  nameofexaminationControl = computed(
    () => this.EducationForm.get('ExamTitle') as FormControl
  );
  educationalInstitutionControl = computed(
    () => this.EducationForm.get('InstituteName') as FormControl<string>
  );
  majorgroupControl = computed(
    () => this.EducationForm.get('MajorGroup') as FormControl
  );
  boardControl = computed(
    () => this.EducationForm.get('BoardId') as FormControl
  );
  educationyearControl = computed(
    () => this.EducationForm.get('PassingYear') as FormControl
  );

  showPassingYear = computed(() => {
    const value = this.additionalListControl().value;
    return value === 3 || value === 4 || value === 5 || value === 6; // Show for Diploma, BSc, Masters, PhD
  });

  showOtherExamTitle = computed(() => {
    return this.nameofexaminationControl().value === '0'; // Show when 'Other' is selected
  });

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const type = params.get('type');
      this.isBlueCollar = type === 'b';
      this.isDisability = type === 'd';
      if (this.isBlueCollar || this.isDisability) {
        this.currentLanguage = 'bn';
        this.translocoService.setActiveLang('bn');
      }
      // Store account type in service
      this.createAccountService.setAccountType(type || 'w');

      this.guid = decodeURIComponent(this.cookieService.getCookie('MybdjobsGId') as string);
      this.EducationForm.get('GuidId')?.setValue(this.guid);
      console.log('Cookie from GUID:', this.guid);
    });

    //year list loading here
    this.generateYearList();
    // Initial API call with language payload to load education levels and board names.
    this.educationService
      .getUserEducationData({ lang: this.currentLanguage })
      .subscribe((response) => {
        // Extract education levels and board names from the response
        const eduLevels: GetEduLevelInfoResponse[] = response.eduLevels || [];

        this.educationOptions.set(eduLevels.map((level) => ({
          label: level.eduLevel || '',
          value: level.e_Code,
        })));
        if (this.educationOptions().length) {
          this.additionalListControl().setValue(this.educationOptions()[0].value);
        }
      });

    // Subscribe to changes in the EducationLevel control.
    // When the value changes (i.e. an e_Code is selected), fetch the corresponding exam degree names.
    this.additionalListControl().valueChanges.subscribe((value) => {
      if (value !== null) {
        this.loadExamTitles(value);
      }
    });

    this.EducationForm.get('InstituteName')
      ?.valueChanges.pipe(
        skip(2),
        debounceTime(300),
        filter((value): value is string => value !== null),
        distinctUntilChanged(),
      )
      .subscribe((value: string) => {
        if (this.isSelectingInstitute) {
          this.isSelectingInstitute = false;
          return;
        }
        if(!value.length) {
          this.instituteSuggestions.set([]);
          return;
        }
        // Only trigger auto-suggestion if both EducationLevel and ExamTitle are selected
        const educationLevel = this.EducationForm.get('EducationLevel')?.value;
        const examTypeId = this.EducationForm.get('ExamTitle')?.value;
        if (educationLevel && examTypeId) {
          const examTitle = this.examTitleOptions().find(opt => opt.value === examTypeId)?.label as string;
          const payload: InstituteSearchPayload = {
            condition: '',
            banglaField: '',
            con1: educationLevel.toString(), // exam title value (e.g., "-3")
            examTitle: examTitle, // e.g., "PSC"
            langType: '',
            param: '5', // always "5"
            strData: value, // institute name typed
          };
          this.educationService.getInstituteSuggestions(payload).subscribe({
            next: (institutes) => {
              this.instituteSuggestions.set(institutes);
            },
            error: (error) => {
              console.error('Error fetching institute suggestions:', error);
            },
          });
        }
      });

    this.EducationForm.controls.HasEducation
      .valueChanges.subscribe(
        () => this.setFormValidator()
      );
  }

  setFormValidator() {
    this.EducationForm.controls.GuidId.setValidators(this.hasEducationControl().value === 1 ? [Validators.required] : null);
    this.EducationForm.controls.EducationLevel.setValidators(this.hasEducationControl().value === 1 ? [Validators.required] : null);
    this.EducationForm.controls.InstituteName.setValidators(this.hasEducationControl().value === 1 ? [Validators.required, Validators.minLength(3)] : null);
    this.EducationForm.controls.PassingYear.setValidators(this.hasEducationControl().value === 1 ? [Validators.required] : null);
    this.EducationForm.controls.ExamTitle.setValidators(this.hasEducationControl().value === 1 ? [Validators.required] : null);
    this.EducationForm.controls.MajorGroup.setValidators(this.hasEducationControl().value === 1 ? [Validators.maxLength(150)] : null);
    this.EducationForm.controls.EducationType.setValidators(this.hasEducationControl().value === 1 ? [Validators.required] : null);
    if(this.hasEducationControl().value) {
      this.EducationForm.markAsUntouched();
    }
    Object.keys(this.EducationForm.controls).forEach(key => {
      this.EducationForm.get(key)?.updateValueAndValidity({ emitEvent: false });
    });
    console.log('set Validator Called');
  }

  loadExamTitles(eCode: number) {
    this.educationService
      .getUserEducationData({ lang: this.currentLanguage.toUpperCase(), eCode })
      .subscribe((response) => {
        const examDegrees: GetDegreeNameResponse[] = response.educationDegrees || [];

        const boards: GetBoardNameResponse[] = response.boardNames || [];
        this.boardOptions.set(boards.map((board) => ({
          label: (this.currentLanguage === 'en' ? board.boardName : board.boardNameBng) ?? '',
          value: board.boardId,
        })));

        // Reset options with the static "Other" value
        this.examTitleOptions.set([]);
        if (examDegrees.length > 0) {
          this.examTitleOptions().push(
            ...examDegrees.map((degree) => ({
              label: degree.degreeName || '',
              value: degree.educationType,
            }))
          );
        }
        this.examTitleOptions().push({ label: 'Other', value: 5 });
        if (this.examTitleOptions().length) {
          this.nameofexaminationControl().setValue(
            this.examTitleOptions()[0].value
          );
        }
      });
  }

  onRadioSelectionChange(value: number) {
    const disable = value === 0;
    this.isDisabled.set(disable);
  }

  checkValidation(): boolean {
    if (this.EducationForm.invalid && this.hasEducationControl().value) {
      this.EducationForm.markAllAsTouched();
      return false;
    }
    return true;
  }

  onSubmit(): void {
    if (this.checkValidation()) {
      if(this.hasEducationControl().value) {
        const selectedExamTitleValue = this.nameofexaminationControl().value;
        const selectedExamTitleLabel =
          this.examTitleOptions().find(
            (item) => item.value == selectedExamTitleValue
          )?.label ?? '';
        const payload: EducationPost = {
          userGuidId: this.guid,
          hasEducation: true, // always true
          educationLevel: this.additionalListControl().value ?? -3,
          instituteName: this.educationalInstitutionControl().value ?? '',
          passingYear: this.educationyearControl().value ?? 0,
          examTitle: selectedExamTitleLabel,
          boardId: this.boardControl().value ?? 0,
          majorGroup: this.majorgroupControl().value ?? '',
          educationType: this.nameofexaminationControl().value,
        };
        console.log(payload);

        // Call the post API to submit education data.
        this.educationService.postUserEducation(payload).subscribe((response) => {
          console.log('Form submitted successfully', response);
          // Navigate to experience page
          this.router.navigate(['create-account/upload-photo']);
        });
      } else {
        this.router.navigate(['create-account/upload-photo']);
      }
    } else {
      console.log('error in submitting the form');
    }
  }
  // When a suggestion is clicked, update the InstituteName form control and clear suggestions.

  selectInstitute(institute: Institute) {
    this.isSelectingInstitute = true;
    this.EducationForm.get('InstituteName')?.setValue(institute.instituteName);
    this.instituteSuggestions.set([]);
  }
}

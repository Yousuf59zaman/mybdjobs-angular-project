import {
  Component,
  computed,
  EventEmitter,
  inject,
  Output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { PersonalDetailsFormService } from '../services/personal-details-form.service';

import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { formatDate } from '@angular/common';
import { PersonalDetailsPayload } from '../models/PersonalInfoPayload';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { EventDataValue, SelectItem } from '../../models/personal-info-model';
import { InputComponent } from '../../../../../../../shared/components/input/input.component';
import { DatepickerComponent } from '../../../../../../../shared/components/datepicker/datepicker.component';
import { SelectboxComponent } from '../../../../../../../shared/components/selectbox/selectbox.component';
import { DateSingleDatePickerComponent } from '../../../../../../../shared/components/date-single-date-picker/date-single-date-picker.component';
import { CookieService } from '../../../../../../../core/services/cookie/cookie.service';

@Component({
  selector: 'app-personal-details-form',
  imports: [
    InputComponent,
    ReactiveFormsModule,
    SelectboxComponent,
    DateSingleDatePickerComponent,
    TranslocoModule,
  ],
  templateUrl: './personal-details-form.component.html',
  styleUrl: './personal-details-form.component.scss',
  standalone: true,
  providers: [provideTranslocoScope('personal')],
})
export class PersonalDetailsFormComponent {
  @Output() onClose = new EventEmitter<void>();
  @Output() onSaveAndClose = new EventEmitter<void>();
  personalInfoService = inject(PersonalDetailsFormService);
  cookieService = inject(CookieService);
  // UserGuid: string =
  //   'ZRDhZ7YxZEYyITPbBQ00PFPiMTDhBTUyPRmbPxdxYiObIFZ9BFPtBFVUIGL3Ung=';
  isCvPosted: number = 1;
  personalInfo: EventDataValue | null = null;
  profilePhotoUrl: string = '';
  rawDate: string = '';
  isBlue: boolean = false;

  countryList: SelectItem[] = [
    { label: 'AF', value: '93' },
    { label: 'AL', value: '355' },
    { label: 'DZ', value: '213' },
    { label: 'AD', value: '376' },
    { label: 'AO', value: '244' },
    { label: 'AG', value: '1268' },
    { label: 'AR', value: '54' },
    { label: 'AM', value: '374' },
    { label: 'AU', value: '61' },
    { label: 'AT', value: '43' },
    { label: 'AZ', value: '994' },
    { label: 'BS', value: '1242' },
    { label: 'BH', value: '973' },
    { label: 'BD', value: '88' },
    { label: 'BB', value: '1246' },
    { label: 'BY', value: '375' },
    { label: 'BE', value: '32' },
    { label: 'BZ', value: '501' },
    { label: 'BJ', value: '229' },
    { label: 'BT', value: '975' },
    { label: 'BO', value: '591' },
    { label: 'BA', value: '387' },
    { label: 'BW', value: '267' },
    { label: 'BR', value: '55' },
    { label: 'BN', value: '673' },
    { label: 'BG', value: '359' },
    { label: 'BF', value: '226' },
    { label: 'BI', value: '257' },
    { label: 'KH', value: '855' },
    { label: 'CM', value: '237' },
    { label: 'CA', value: '1' },
    { label: 'CV', value: '238' },
    { label: 'CF', value: '236' },
    { label: 'TD', value: '235' },
    { label: 'CL', value: '56' },
    { label: 'CN', value: '86' },
    { label: 'CO', value: '57' },
    { label: 'KM', value: '269' },
    { label: 'CG', value: '242' },
    { label: 'CD', value: '243' },
    { label: 'CR', value: '506' },
    { label: 'CI', value: '225' },
    { label: 'HR', value: '385' },
    { label: 'CU', value: '53' },
    { label: 'CY', value: '357' },
    { label: 'CZ', value: '420' },
    { label: 'DK', value: '45' },
    { label: 'DJ', value: '253' },
    { label: 'DM', value: '1767' },
    { label: 'DO', value: '1809' },
    { label: 'EC', value: '593' },
    { label: 'EG', value: '20' },
    { label: 'SV', value: '503' },
    { label: 'GQ', value: '240' },
    { label: 'ER', value: '291' },
    { label: 'EE', value: '372' },
    { label: 'SZ', value: '268' },
    { label: 'ET', value: '251' },
    { label: 'FJ', value: '679' },
    { label: 'FI', value: '358' },
    { label: 'FR', value: '33' },
    { label: 'GA', value: '241' },
    { label: 'GM', value: '220' },
    { label: 'GE', value: '995' },
    { label: 'DE', value: '49' },
    { label: 'GH', value: '233' },
    { label: 'GR', value: '30' },
    { label: 'GD', value: '1473' },
    { label: 'GT', value: '502' },
    { label: 'GN', value: '224' },
    { label: 'GW', value: '245' },
    { label: 'GY', value: '592' },
    { label: 'HT', value: '509' },
    { label: 'HN', value: '504' },
    { label: 'HU', value: '36' },
    { label: 'IS', value: '354' },
    { label: 'IN', value: '91' },
    { label: 'ID', value: '62' },
    { label: 'IR', value: '98' },
    { label: 'IQ', value: '964' },
    { label: 'IE', value: '353' },
    { label: 'IL', value: '972' },
    { label: 'IT', value: '39' },
    { label: 'JM', value: '1876' },
    { label: 'JP', value: '81' },
    { label: 'JO', value: '962' },
    { label: 'KZ', value: '7' },
    { label: 'KE', value: '254' },
    { label: 'KI', value: '686' },
    { label: 'KP', value: '850' },
    { label: 'KR', value: '82' },
    { label: 'KW', value: '965' },
    { label: 'KG', value: '996' },
    { label: 'LA', value: '856' },
    { label: 'LV', value: '371' },
    { label: 'LB', value: '961' },
    { label: 'LS', value: '266' },
    { label: 'LR', value: '231' },
    { label: 'LY', value: '218' },
    { label: 'LI', value: '423' },
    { label: 'LT', value: '370' },
    { label: 'LU', value: '352' },
    { label: 'MG', value: '261' },
    { label: 'MW', value: '265' },
    { label: 'MY', value: '60' },
    { label: 'MV', value: '960' },
    { label: 'ML', value: '223' },
    { label: 'MT', value: '356' },
    { label: 'MH', value: '692' },
    { label: 'MR', value: '222' },
    { label: 'MU', value: '230' },
    { label: 'MX', value: '52' },
    { label: 'FM', value: '691' },
    { label: 'MD', value: '373' },
    { label: 'MC', value: '377' },
    { label: 'MN', value: '976' },
    { label: 'ME', value: '382' },
    { label: 'MA', value: '212' },
    { label: 'MZ', value: '258' },
    { label: 'MM', value: '95' },
    { label: 'NA', value: '264' },
    { label: 'NR', value: '674' },
    { label: 'NP', value: '977' },
    { label: 'NL', value: '31' },
    { label: 'NZ', value: '64' },
    { label: 'NI', value: '505' },
    { label: 'NE', value: '227' },
    { label: 'NG', value: '234' },
    { label: 'MK', value: '389' },
    { label: 'NO', value: '47' },
    { label: 'OM', value: '968' },
    { label: 'PK', value: '92' },
    { label: 'PW', value: '680' },
    { label: 'PA', value: '507' },
    { label: 'PG', value: '675' },
    { label: 'PY', value: '595' },
    { label: 'PE', value: '51' },
    { label: 'PH', value: '63' },
    { label: 'PL', value: '48' },
    { label: 'PT', value: '351' },
    { label: 'QA', value: '974' },
    { label: 'RO', value: '40' },
    { label: 'RU', value: '7' },
    { label: 'RW', value: '250' },
    { label: 'KN', value: '1869' },
    { label: 'LC', value: '1758' },
    { label: 'VC', value: '1784' },
    { label: 'WS', value: '685' },
    { label: 'SM', value: '378' },
    { label: 'ST', value: '239' },
    { label: 'SA', value: '966' },
    { label: 'SN', value: '221' },
    { label: 'RS', value: '381' },
    { label: 'SC', value: '248' },
    { label: 'SL', value: '232' },
    { label: 'SG', value: '65' },
    { label: 'SK', value: '421' },
    { label: 'SI', value: '386' },
    { label: 'SB', value: '677' },
    { label: 'SO', value: '252' },
    { label: 'ZA', value: '27' },
    { label: 'SS', value: '211' },
    { label: 'ES', value: '34' },
    { label: 'LK', value: '94' },
    { label: 'SD', value: '249' },
    { label: 'SR', value: '597' },
    { label: 'SE', value: '46' },
    { label: 'CH', value: '41' },
    { label: 'SY', value: '963' },
    { label: 'TW', value: '886' },
    { label: 'TJ', value: '992' },
  ];

  gender = signal([
    {
      label: 'Male',
      value: 'M',
    },
    {
      label: 'Female',
      value: 'F',
    },
    {
      label: 'Others',
      value: 'O',
    },
  ]);

  religion = signal([
    {
      label: 'Islam',
      value: 'Muslim',
    },
    {
      label: 'Hinduism',
      value: 'hinduism',
    },
    {
      label: 'Christianity',
      value: 'christianity',
    },
    {
      label: 'Buddhism',
      value: 'buddhism',
    },
    {
      label: 'Others',
      value: 'others',
    },
  ]);

  maritalStatus = signal([
    {
      label: 'Single',
      value: '3',
    },
    {
      label: 'Married',
      value: '2',
    },
    {
      label: 'Unmarried',
      value: '1',
    },
  ]);

  bloodGroup = signal([
    {
      label: 'A+',
      value: 'a+',
    },
    {
      label: 'A-',
      value: 'a-',
    },
    {
      label: 'B+',
      value: 'b+',
    },
    {
      label: 'B-',
      value: 'b-',
    },
    {
      label: 'AB+',
      value: 'Ab+',
    },
    {
      label: 'AB-',
      value: 'Ab-',
    },
    {
      label: 'O+',
      value: 'o+',
    },
    {
      label: 'O-',
      value: 'o-',
    },
  ]);
  suggestions: string[] = [];

  form = new FormGroup({
    firstName: new FormControl<string | null>(null, [Validators.required]),
    lastName: new FormControl<string | null>(null),
    fatherName: new FormControl<string | null>(null),
    motherName: new FormControl<string | null>(null),
    dateOfBirth: new FormControl<string | null>(null, [Validators.required]),
    gender: new FormControl<string | null>(null, [Validators.required]),
    religion: new FormControl<string | null>(null),
    maritalStatus: new FormControl<number | null>(null, [Validators.required]),
    isBangladeshi: new FormControl<boolean>(false),
    nationality: new FormControl<string | null>(null, [Validators.required]),
    nationalId: new FormControl<string | null>(null),
    passportNumber: new FormControl<string | null>(null),
    passportIssueDate: new FormControl<string | null>(null),
    primaryPhone: new FormControl<string | null>(null, [Validators.required]),
    secondaryPhone: new FormControl<string | null>(null),
    emergencyContact: new FormControl<string | null>(null),
    primaryEmail: new FormControl<string | null>(null),
    alternateEmail: new FormControl<string | null>(null),
    bloodGroup: new FormControl<string | null>(null),
    height: new FormControl<number | null>(null),
    weight: new FormControl<number | null>(null),
    countryCode: new FormControl<string>(''),
    birthplace: new FormControl<string | null>(null),
  });

  constructor() {
    this.setupPhoneValidation();
  }
  birthplaceControl = computed(
    () => this.form.get('birthplace') as FormControl<string | null>
  );
  isBangladeshiControl = computed(
    () => this.form.get('isBangladeshi') as FormControl<boolean>
  );

  firstNameControl = computed(
    () => this.form.get('firstName') as FormControl<string | null>
  );
  lastNameControl = computed(
    () => this.form.get('lastName') as FormControl<string | null>
  );
  fatherNameControl = computed(
    () => this.form.get('fatherName') as FormControl<string | null>
  );
  motherNameControl = computed(
    () => this.form.get('motherName') as FormControl<string | null>
  );
  dateOfBirthControl = computed(
    () => this.form.get('dateOfBirth') as FormControl<string | null>
  );
  genderControl = computed(
    () => this.form.get('gender') as FormControl<string | null>
  );
  religionControl = computed(
    () => this.form.get('religion') as FormControl<string | null>
  );
  maritalStatusControl = computed(
    () => this.form.get('maritalStatus') as FormControl<string | null>
  );
  nationalIdControl = computed(
    () => this.form.get('nationalId') as FormControl<string | null>
  );
  passportNumberControl = computed(
    () => this.form.get('passportNumber') as FormControl<string | null>
  );
  passportIssueDateControl = computed(
    () => this.form.get('passportIssueDate') as FormControl<string | null>
  );
  secondaryPhoneControl = computed(
    () => this.form.get('secondaryPhone') as FormControl<string | null>
  );
  emergencyContactControl = computed(
    () => this.form.get('emergencyContact') as FormControl<string | null>
  );
  primaryEmailControl = computed(
    () => this.form.get('primaryEmail') as FormControl<string | null>
  );
  alternateEmailControl = computed(
    () => this.form.get('alternateEmail') as FormControl<string | null>
  );
  bloodGroupControl = computed(
    () => this.form.get('bloodGroup') as FormControl<string | null>
  );
  heightControl = computed(
    () => this.form.get('height') as FormControl<number | null>
  );
  weightControl = computed(
    () => this.form.get('weight') as FormControl<number | null>
  );

  onBangladeshiCheckboxChange() {
    const isChecked = this.form.get('isBangladeshi')?.value;
    const nationalityControl = this.form.get('nationality');

    if (isChecked) {
      nationalityControl?.setValue('Bangladeshi');
      nationalityControl?.disable();
      this.suggestions = [];
    } else {
      nationalityControl?.enable();
      nationalityControl?.setValue('');
    }
  }
  private destroy$ = new Subject<void>();
  private lastSearchTerm: string = '';
  userGuidId: string | null = '';

  ngOnInit(): void {
    // const rawGuid = this.cookieService.getCookie('MybdjobsGId');  //uncomment this line before testing/live
    const rawGuid =
    this.cookieService.getCookie('MybdjobsGId'); // for development only
    this.userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;

    const accountType = this.cookieService.getCookie('IsBlueCaller');
    if (accountType === 'True') {
      this.isBlue = true;
    } else {
      this.isBlue = false;
    }

    this.loadPersonalInfo();

    this.setupNationalitySuggestions();

    // Initial sync for existing Bangladeshi value
    if (this.form.get('nationality')?.value === 'Bangladeshi') {
      this.form.get('isBangladeshi')?.setValue(true);
      this.form.get('nationality')?.disable();
    }
  }
  private skipNextUpdate = false;
  private setupNationalitySuggestions(): void {
    this.destroy$.next();

    this.form
      .get('nationality')!
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        filter(
          () => this.form.get('nationality')!.enabled && !this.skipNextUpdate
        ),
        debounceTime(400),
        distinctUntilChanged((prev, curr) => prev?.trim() === curr?.trim()),
        tap((term) => (this.lastSearchTerm = term?.toString().trim() || '')),
        switchMap((term) => {
          const q = term?.trim() || '';
          if (q.length < 2) {
            this.suggestions = [];
            return of([]);
          }
          return this.personalInfoService.getSuggestions(q).pipe(
            catchError(() => {
              this.suggestions = [];
              return of([]);
            })
          );
        })
      )
      .subscribe((response: any) => {
        try {
          if (response?.eventData) {
            const messageData = response.eventData.find(
              (d: any) => d.key === 'Message'
            );
            if (messageData?.value) {
              this.suggestions = messageData.value.reduce(
                (acc: string[], current: any) => {
                  if (current?.locationResponse) {
                    const names = current.locationResponse.map(
                      (loc: any) => loc.locationName
                    );
                    return [...acc, ...names];
                  }
                  return acc;
                },
                []
              );
            } else {
              this.suggestions = [];
            }
          } else {
            this.suggestions = [];
          }
          this.suggestions = [...new Set(this.suggestions.filter(Boolean))];
        } catch (e) {
          console.error('Error processing suggestions', e);
          this.suggestions = [];
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectSuggestion(name: string) {
    this.skipNextUpdate = true;
    this.form.get('nationality')?.setValue(name);
    this.suggestions = [];
    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
      this.skipNextUpdate = false;
    });
  }

  onNationalityFocus() {
    const curr = this.form.get('nationality')!.value?.toString().trim() || '';
    if (curr.length >= 2 && curr !== this.lastSearchTerm) {
      this.setupNationalitySuggestions();
    }
  }

  loadPersonalInfo(): void {
    const responseData = this.personalInfoService.cachedData.subscribe({
      next: (response) => {
        if (response) {
          if (response) {
            const successData = response.event.eventData.find(
              (d) => d.key === 'message'
            );

            if (successData) {
              this.personalInfo = successData.value;
              this.bindFormData();
            } else {
              console.warn(
                'Success key not found or API returned success = true'
              );
            }
          } else {
            console.warn(
              'No cached personal info found. Call getPersonalInfo() first.'
            );
          }
        }
      },
      error: (err) => console.error('Failed to load personal info', err),
    });
  }

  private setupPhoneValidation(): void {
    const phoneCtrl = this.form.get('primaryPhone')!;
    this.form
      .get('countryCode')!
      .valueChanges.pipe(startWith(this.form.get('countryCode')!.value))
      .subscribe((code) => {
        if (code === '880') {
          phoneCtrl.setValidators([
            Validators.required,
            Validators.pattern(/^\d{11}$/), // Ensures exactly 11 digits
          ]);
        } else {
          phoneCtrl.setValidators([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(15), // Added maxLength to match template error
            Validators.pattern(/^\d+$/),
          ]);
        }
        phoneCtrl.updateValueAndValidity({ emitEvent: false });
      });
  }

  bindFormData(): void {
    if (!this.personalInfo) return;

    // Set values using computed controls
    this.firstNameControl().setValue(this.personalInfo.accFirstName);
    this.lastNameControl().setValue(this.personalInfo.accLastName);
    this.fatherNameControl().setValue(this.personalInfo.fName);
    this.motherNameControl().setValue(this.personalInfo.mName);
    this.genderControl().setValue(this.personalInfo.accGender);
    this.religionControl().setValue(this.personalInfo.relegion);
    this.maritalStatusControl().setValue(this.personalInfo.m_Status);
    this.form.get('nationality')?.setValue(this.personalInfo.nationality);
    this.nationalIdControl().setValue(this.personalInfo.nid);
    this.passportNumberControl().setValue(this.personalInfo.passportNo);
    this.form.get('primaryPhone')?.setValue(this.personalInfo.accPhone);
    this.secondaryPhoneControl().setValue(this.personalInfo.home_Phone);
    this.emergencyContactControl().setValue(this.personalInfo.office_Phone);
    this.primaryEmailControl().setValue(this.personalInfo.accEmail);
    this.alternateEmailControl().setValue(this.personalInfo.e_mail2);
    this.bloodGroupControl().setValue(this.personalInfo.bloodGroup);
    this.heightControl().setValue(this.personalInfo.pHeight);
    this.weightControl().setValue(this.personalInfo.pWeight);
    this.form.get('countryCode')?.setValue(this.personalInfo.accCountryCode);

    if (this.personalInfo.birth) {
      const rawDate = this.personalInfo.birth;
      const formattedDate = formatDate(rawDate, 'dd-MM-yyyy', 'en-GB');
      this.dateOfBirthControl().setValue(formattedDate);
      this.rawBirthIso = this.personalInfo.birth;
    }

    if (this.personalInfo.passportIssueDate) {
      const rawDate = this.personalInfo.passportIssueDate;
      const formattedDate = formatDate(rawDate, 'dd-MM-yyyy', 'en-GB');
      this.passportIssueDateControl().setValue(formattedDate);
      this.rawPassportIso = this.personalInfo.passportIssueDate;
    }
  }

  savePersonalInfo(): void {
    this.markFormGroupTouched(this.form);

    if (this.form.invalid) {
      console.error('Form is invalid');
      return;
    }

    const payload = this.preparePayload();

    this.personalInfoService.savePersonalInfo(payload).subscribe({
      next: (response) => {
        this.closeForm();
        this.onSaveAndClose.emit();
      },
      error: (error) => {
        // Handle error (show error message)
      },
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private preparePayload(): PersonalDetailsPayload {
    const formValue = this.form.getRawValue();

    return {
      userGuid: this.userGuidId ?? '', // Set appropriate user ID
      firstName: formValue.firstName || '',
      lastName: formValue.lastName || '',
      fName: formValue.fatherName || '',
      mName: formValue.motherName || '',
      birth: formValue.dateOfBirth
        ? this.parseDdMmYyyyToIso(formValue.dateOfBirth)
        : '',
      sex: formValue.gender || '',
      mStatus: formValue.maritalStatus || 0,
      nationality: formValue.nationality || '',
      religion: formValue.religion || '',
      nid: formValue.nationalId || '',
      mobile: formValue.primaryPhone || '',
      passportNo: formValue.passportNumber || '',
      passportIssueDate: formValue.passportIssueDate
        ? this.parseDdMmYyyyToIso(formValue.passportIssueDate)
        : '',
      email1: formValue.primaryEmail || '',
      email2: formValue.alternateEmail || '',
      officePhone: formValue.emergencyContact || '',
      homePhone: formValue.secondaryPhone || '',
      bloodGroup: formValue.bloodGroup || '',
      birthPlace: formValue.birthplace || '',
      height: formValue.height?.toString() || '',
      weight: formValue.weight?.toString() || '',
      countryCode: parseInt(formValue.countryCode || '880', 10),
      updatedOn: new Date().toISOString(),
      bflag: 2,
    };
  }

  private rawBirthIso = '';
  private rawPassportIso = '';

  onStartDateChanged(date: Date | null): void {
    if (date) {
      this.rawBirthIso = date.toISOString();
      const display = formatDate(date, 'dd-MM-yyyy', 'en-GB');
      this.dateOfBirthControl().setValue(display);
    }
  }
  onPassportIssueDateChanged(date: Date | null): void {
    if (date) {
      this.rawPassportIso = date.toISOString();
      const display = formatDate(date, 'dd-MM-yyyy', 'en-GB');
      this.passportIssueDateControl().setValue(display);
    }
  }

  private parseDdMmYyyyToIso(display: string): string {
    // “02-04-2025” → [ "02", "04", "2025" ]
    const [day, month, year] = display.split('-').map((v) => Number(v));
    // construct a UTC date at midnight
    const dt = new Date(Date.UTC(year, month - 1, day));
    return dt.toISOString(); // e.g. "2025-04-02T00:00:00.000Z"
  }

  closeForm() {
    this.onClose.emit();
  }
}

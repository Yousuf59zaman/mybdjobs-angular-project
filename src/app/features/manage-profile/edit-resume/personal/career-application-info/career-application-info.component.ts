import { NgClass } from '@angular/common';
import { Component, inject, input, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { TextEditorComponent } from "../../../../../shared/components/text-editor/text-editor.component";
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { GetCareerInfoQuery, UpdateCareerInfo } from './model/career-application-info';
import { CareerApplicationInfoServiceService } from './service/career-application-info-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CookieService } from '../../../../../core/services/cookie/cookie.service';
import { TooltipsComponent } from '../../../../../shared/components/tooltips/tooltips.component';
import { NoDetailsComponent } from "../../../../../shared/components/no-details/no-details.component";
import { AccordionMainBodyComponent } from "../../../../../shared/components/accordion-main-body/accordion-main-body.component";

function objectiveLength(maxChars: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.replace(/<[^>]*>/g, '').trim();
    if (!value) return null;
    return value.length > maxChars ? { maxLength: true } : null;
  };
}

@Component({
  selector: 'app-career-application-info',
  standalone: true,
  imports: [NgClass, TextEditorComponent, InputComponent, TooltipsComponent, ReactiveFormsModule, TranslocoModule, NoDetailsComponent],
  providers: [provideTranslocoScope('editResumeCareerInfo')],
  templateUrl: './career-application-info.component.html',
  styleUrl: './career-application-info.component.scss'
})
export class CareerApplicationInfoComponent implements OnChanges {

  //@Input() UserGuid: string;
  isCareerSectionOpen = input(false);
  isCareerFormOpen = signal(false);
  objectiveError = signal('');
  objectiveCharCount = signal(0);
  objectiveLength = signal(0);
  readonly MAX_OBJECTIVE_LENGTH = 250;
  readonly MAX_OBJECTIVE_WORDS = 250;
  currentLanguage = 'en';
  isInfoAvailable = false;
  UserGuid: string | null = null;
  private id = "career"
  private accordionService = inject(AccordionManagerService)
  private readonly careerService = inject(CareerApplicationInfoServiceService);

  tooltipArray = [
    {
      id: '1',
      title: 'Good Example',
      description: 'To secure a position with a well-established organization with a stable environment that will lead to a lasting relationship in the field of HealthCare. To obtain a position that will enable the use of my strong organizational skills, Microsoft expertise, and ability to work well with people.'
    },
    {
      id: '2',
      title: 'Bad Example',
      description: 'My objective is to deliver my best to satisfy my clients. I am dedicated and hard working. I will be very much active to meet the deadlines of your company.'
    },
  ]


  constructor(private translocoService: TranslocoService, private cookieService: CookieService) {
    this.translocoService.langChanges$.subscribe((lang) => {
      this.currentLanguage = lang;
      this.lnChangeForjobLevel();
      this.lnChangeForjobNature();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isCareerSectionOpen() && !this.isOpen()) {
      const willOpen = !this.accordionService.isOpen(this.id)();
      this.toggle();
      if (willOpen) {
        this.loadCareerInfo();
      }
    }
  }

  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    this.accordionService.toggle(this.id);
  }
  careerForm = new FormGroup({
    obj: new FormControl('', [
      Validators.required,
      Validators.pattern(/\S/),
      objectiveLength(this.MAX_OBJECTIVE_WORDS)
    ]),
    cur_Sal: new FormControl('', [
      Validators.pattern('^[0-9]{1,9}$')
    ]),
    exp_Sal: new FormControl('', [
      Validators.pattern('^[0-9]{1,10}$')
    ]),
    available: new FormControl(''),
    pref: new FormControl('')
  });

  jobLevel: any[] = [];
  jobNature: any[] = [];

  private lnChangeForjobLevel() {
    if (this.currentLanguage === 'en') {
      this.jobLevel = [
        { label: 'Entry Level', value: 'Entry' },
        { label: 'Mid Level', value: 'Mid' },
        { label: 'Top Level', value: 'Top' },
      ];
    }
    else {

      this.jobLevel = [
        { label: 'এন্ট্রি লেভেল জব', value: 'Entry' },
        { label: 'মিড/ম্যানেজারিয়াল লেভেল জব', value: 'Mid' },
        { label: 'টপ লেভেল জব', value: 'Top' },
      ];
    }
  }

  private lnChangeForjobNature() {
    if (this.currentLanguage === 'en') {
      this.jobNature = [
        {
          label: 'Full time',
          value: 'Full time'
        },
        {
          label: 'Part time',
          value: 'Part time'
        },
        {
          label: 'Contract',
          value: 'Contract'
        },
        {
          label: 'Internship',
          value: 'Internship'
        },
        {
          label: 'Freelance',
          value: 'Freelance'
        },
      ];
    }
    else {
      this.jobNature = [
        {
          label: 'ফুল টাইম',
          value: 'Full time'
        },
        {
          label: 'পার্ট টাইম',
          value: 'Part time'
        },
        {
          label: 'কন্ট্রাক',
          value: 'Contract'
        },
        {
          label: 'ইন্টার্নশিপ',
          value: 'Internship'
        },
        {
          label: 'ফ্রিল্যান্স',
          value: 'Freelance'
        },
      ];
    }

  }

  ngOnInit(): void {
    // this.loadCareerInfo();
    this.careerForm.get('objective')?.valueChanges.subscribe((value) => {
      this.updateCounts(value || '');
    });
  }
  cleanValue(value: string | null): string {
    if (!value) return '';
    let cleaned = value.replace(/<p>\s*<\/p>/g, '');
    if (cleaned.match(/^<p>(.*?)<\/p>$/)) {
      cleaned = cleaned.replace(/^<p>(.*?)<\/p>$/, '$1');
    }
    return cleaned;
  }
  updateCounts(text: string) {
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    const currentCharCount = cleanText.length;

    if (currentCharCount > this.MAX_OBJECTIVE_LENGTH) {
      const truncatedText = cleanText.slice(0, this.MAX_OBJECTIVE_LENGTH);
      this.objectiveControl.setValue(truncatedText);
      this.objectiveError.set(`Maximum ${this.MAX_OBJECTIVE_LENGTH} characters allowed`);
      return;
    }

    this.objectiveCharCount.set(currentCharCount);
    this.objectiveLength.set(currentCharCount);

    if (!cleanText) {
      this.objectiveControl.setErrors({ required: true });
      this.objectiveError.set('Objective is required');
    } else if (currentCharCount > this.MAX_OBJECTIVE_LENGTH) {
      this.objectiveControl.setErrors({ maxLength: true });
      this.objectiveError.set(`Maximum ${this.MAX_OBJECTIVE_LENGTH} characters allowed`);
    } else {
      this.objectiveError.set('');
    }
  }
  loadCareerInfo(): void {
    const query: GetCareerInfoQuery = {
      UserGuid: this.UserGuid ?? '',
    };
    const rawGuid = this.cookieService.getCookie('MybdjobsGId'); // for development only
    this.UserGuid = rawGuid ? decodeURIComponent(rawGuid) : null;

    this.careerService.getCareerInfo(query).subscribe({
      next: (res) => {
        const payload = res.event;
        if (payload.eventData.length > 0 && payload.eventData[0].value) {
          const res = payload.eventData[0].value;
          this.isInfoAvailable = true;
          this.careerForm.patchValue({
            obj: res.obj || '',
            cur_Sal: res.cur_Sal?.toString() || '',
            exp_Sal: res.exp_Sal?.toString() || '',
            pref: res.pref || '',
            available: res.available || ''
          });
        } else {
          this.isInfoAvailable = false;
        }
      },
      error: (error) => {
        console.error('Error loading career info:', error);
        this.isInfoAvailable = false;
      }
    });
  }
  get objectiveControl(): FormControl {
    return this.careerForm.get('obj') as FormControl;
  }

  get currentSalaryControl(): FormControl {
    return this.careerForm.get('cur_Sal') as FormControl;
  }
  get expectedSalaryControl(): FormControl {
    return this.careerForm.get('exp_Sal') as FormControl;
  }

  get jobLevelControl(): FormControl {
    return this.careerForm.get('available') as FormControl;
  }

  get jobNatureControl(): FormControl {
    return this.careerForm.get('pref') as FormControl;
  }

  closeCareerForm() {
    this.isCareerFormOpen.set(false)
  }

  openCareerForm() {
    this.isCareerFormOpen.set(true)
  }

  onSave(): void {
    if (this.careerForm.invalid) {
      return;
    }

    const words = this.objectiveControl.value?.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter((word: string) => word.length > 0) || [];
    if (words.length > this.MAX_OBJECTIVE_WORDS) {
      this.objectiveError.set(`Maximum ${this.MAX_OBJECTIVE_WORDS} words allowed`);
      return;
    }

    const payload: UpdateCareerInfo = {
      userGuid: this.UserGuid ?? '',
      objective: this.cleanValue(this.objectiveControl.value),
      present_Salary: parseInt(this.currentSalaryControl.value || '0', 10),
      expected_Salary: parseInt(this.expectedSalaryControl.value || '0', 10),
      available: this.jobNatureControl.value || '',
      job_Level: this.jobLevelControl.value || '',
      isWebOrApp: 1
    };

    this.careerService.updateCareerInfo(payload).subscribe({
      next: (response) => {
        this.isCareerFormOpen.set(false);
      },
      error: (err) => {
      }
    });
  }

  onPresentSalaryInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    if (value.length > 9) {
      input.value = value.slice(0, 9);
      this.currentSalaryControl.setValue(value.slice(0, 9));
    }
  }

  onExpectedSalaryInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    if (value.length > 10) {
      input.value = value.slice(0, 10);
      this.expectedSalaryControl.setValue(value.slice(0, 10));
    }
  }

}

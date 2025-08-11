import { Component, inject, input, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';
import { NgClass } from '@angular/common';
import { TextEditorComponent } from "../../../../../shared/components/text-editor/text-editor.component";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TooltipsComponent } from "../../../../../shared/components/tooltips/tooltips.component";
import { OtherRelevantInfoService } from './service/other-relevant-info.service';
import { GetOtherRelevantInfoQuery, UpdateOtherRelevantInfo } from './model/other-relevantInfo';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { CookieService } from '../../../../../core/services/cookie/cookie.service';
import { NoDetailsComponent } from "../../../../../shared/components/no-details/no-details.component";
import { AccordionMainBodyComponent } from "../../../../../shared/components/accordion-main-body/accordion-main-body.component";
import { GetCareerInfoQuery } from '../career-application-info/model/career-application-info';
@Component({
  selector: 'app-other-relevant-info',
  imports: [TextEditorComponent, TooltipsComponent, TranslocoModule, NoDetailsComponent, AccordionMainBodyComponent],
  providers: [provideTranslocoScope('editResumeOtherRelevant')],
  templateUrl: './other-relevant-info.component.html',
  styleUrl: './other-relevant-info.component.scss'
})
export class OtherRelevantInfoComponent implements OnChanges {

  private readonly MAX_CAREER_SUMMARY_LENGTH = 490;
  private readonly MAX_SPECIAL_QUALIFICATION_LENGTH = 245;

  // @Input() UserGuid!: string;
  isOtherSectionOpen = input(false);
  isOtherFormOpen = signal(false);
  carSumCharCount = signal(0);
  specQualiCharCount = signal(0);
  isInfoAvailable = false;
  UserGuid: string | null = null; // This should be set from the parent component or service
  private id = "others";
  private accordionService = inject(AccordionManagerService);
  private otherService = inject(OtherRelevantInfoService);
  private cookieService = inject(CookieService);

  tooltipCareer = [
    {
      id: '1',
      title: 'Good Example',
      description: 'Example #1 Three years experience working in the_______ (fill in the blank) industry Competent at managing responsibilities in a high-volume atmosphere Skilled at interacting with customers of all socioeconomic backgrounds Hard worker, quick learner, and ability to assume responsibility Example #2 Work well under pressure as part of a team Well-groomed appearance Polite, respectful, and courteous manners Responsible, efficient, and flexible Ability to work in a fast-paced, intense environment smoothly Ability to elicit confidence and build rapport Talented in problem solving and office system design Example #3 Quick learner, eager to further my _____(fill in the blank) knowledge and skills Meticulous worker; attentive to quality and detail Able and willing to assist co-workers, supervisors, and clients in a cooperative manner Committed to providing total quality work Dependable employee with common sense and a variety of skills Work well under pressure to meet deadlines.'
    },
    {
      id: '2',
      title: 'Bad Example',
      description: 'I am very energetic and dedicated to office work. I am regular and know the very basic of your required field. I have 5 years of experience in the field and I think I am the best candidate for your Job post.'
    },
  ]
  tooltipSpeQua = [
    {
      id: '1',
      title: 'Good Example',
      description: 'Example #1 Three years experience working in the_______ (fill in the blank) industry Competent at managing responsibilities in a high-volume atmosphere Skilled at interacting with customers of all socioeconomic backgrounds Hard worker, quick learner, and ability to assume responsibility Example#2 Work well under pressure as part of a team Well-groomed appearance Polite, respectful, and courteous manners Responsible, efficient, and flexible Ability to work in a fast-paced, intense environment smoothly Ability to elicit confidence and build rapport Talented in problem solving and office system design Example #3 Quick learner, eager to further my _____(fill in the blank) knowledge and skillsMeticulous worker; attentive to quality and detail Able and willing to assist co-workers, supervisors, and clients in a cooperative manner Committed to providing total quality work Dependable employee with common sense and a variety of skills Work well under pressure to meet deadlines.'
    },
    {
      id: '2',
      title: 'Bad Example',
      description: 'I am very energetic and dedicated to office work. I am regular and know the very basic of your required field. I have 5 years of experience in the field and I think I am the best candidate for your Job post.'
    },
  ]
  tooltipKeyword = [
    {
      id: '1',
      title: 'What is Keywords?',
      description: 'Keywords are specific words or phrases that job seekers use to search for jobs and employers use to find the right candidates. Keywords are used as search criteria in the same way you do research on the Internet. The more keywords you use, the more closely the job will match what you are really looking for.Example:  MBA, BBA, Photography, Computer Diploma, Visual Basic, Visual C++, Java, HTML, Photo Shop, AIUB, BUET, DU, IBA, NSU etc'
    },
  ];


  ngOnChanges(changes: SimpleChanges): void {
    if (this.isOtherSectionOpen() && !this.isOpen()) {
      const willOpen = !this.accordionService.isOpen(this.id)();
      this.toggle();
      if (willOpen) {
        this.loadOtherInfo();
      }
    }
  }
  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }
  toggle() {
    const wasOpen = this.isOpen();
    this.accordionService.toggle(this.id);
    if (!wasOpen) {
      this.loadOtherInfo();
    }
  }

  closeOtherForm() {
    this.isOtherFormOpen.set(false);
  }
  optionalNoSemicolon(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const plain = value.replace(/<[^>]*>/g, '').trim();
      return plain.includes(';') ? { invalidInput: true } : null;
    };
  }

  requiredNoSemicolon(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return { required: true };
      const plain = value.replace(/<[^>]*>/g, '').trim();
      if (!plain) return { required: true };
      return plain.includes(';') ? { invalidInput: true } : null;
    };
  }

  otherForm = new FormGroup({
    carSum: new FormControl('', [
      this.optionalNoSemicolon(),
      Validators.maxLength(this.MAX_CAREER_SUMMARY_LENGTH)
    ]),
    specQuali: new FormControl('', [
      this.optionalNoSemicolon(),
      Validators.maxLength(this.MAX_SPECIAL_QUALIFICATION_LENGTH)
    ]),
    keyWord: new FormControl('', [this.requiredNoSemicolon()])
  });

  get carSumControl(): FormControl {
    return this.otherForm.get('carSum') as FormControl;
  }
  get specQualiControl(): FormControl {
    return this.otherForm.get('specQuali') as FormControl;
  }
  get keywordsControl(): FormControl {
    return this.otherForm.get('keyWord') as FormControl;
  }

  ngOnInit(): void {
    // this.loadOtherInfo();
    this.setupValueChangeSubscriptions();
  }

  private setupValueChangeSubscriptions(): void {
    this.carSumControl.valueChanges.subscribe(value => {
      const count = this.getCleanTextLength(value);
      this.carSumCharCount.set(count);
      if (count > this.MAX_CAREER_SUMMARY_LENGTH) {
        const truncated = value?.slice(0, this.MAX_CAREER_SUMMARY_LENGTH);
        this.carSumControl.setValue(truncated, { emitEvent: false });
      }
    });

    this.specQualiControl.valueChanges.subscribe(value => {
      const count = this.getCleanTextLength(value);
      this.specQualiCharCount.set(count);
      if (count > this.MAX_SPECIAL_QUALIFICATION_LENGTH) {
        const truncated = value?.slice(0, this.MAX_SPECIAL_QUALIFICATION_LENGTH);
        this.specQualiControl.setValue(truncated, { emitEvent: false });
      }
    });
  }

  private getCleanTextLength(value: string | null): number {
    if (!value) return 0;
    return value.replace(/<[^>]*>/g, '').trim().length;
  }

  getOtherSummaryLength(): number {
    return this.carSumCharCount();
  }

  getSpecialQualificationLength(): number {
    return this.specQualiCharCount();
  }

  get keywordsErrorMessage(): string {
    if (this.keywordsControl.hasError('required')) return 'Keywords cannot be empty.';
    if (this.keywordsControl.hasError('invalidInput')) return 'Please enter valid input.';
    return '';
  }

  get carSumErrorMessage(): string {
    if (this.carSumControl.hasError('invalidInput')) return 'Please enter valid input.';
    if (this.carSumControl.hasError('maxlength')) return `Maximum ${this.MAX_CAREER_SUMMARY_LENGTH} characters allowed.`;
    return '';
  }

  get specQualiErrorMessage(): string {
    if (this.specQualiControl.hasError('invalidInput')) return 'Please enter valid input.';
    if (this.specQualiControl.hasError('maxlength')) return `Maximum ${this.MAX_SPECIAL_QUALIFICATION_LENGTH} characters allowed.`;
    return '';
  }


  onAddNewClick(): void {
  this.isInfoAvailable = true; // Show the form section
  this.isOtherFormOpen.set(true); // Open the form
  this.otherForm.reset(); // Reset the form for new entry
}

  loadOtherInfo(): void {
  const rawGuid = this.cookieService.getCookie('MybdjobsGId');  // for development only
  this.UserGuid = rawGuid ? decodeURIComponent(rawGuid) : null;

 const query: GetOtherRelevantInfoQuery = {
      UserGuid: this.UserGuid ?? '',
    };

  this.otherService.getOtherInfo(this.UserGuid ?? '')
    .subscribe({
      next: (info) => {
        this.isInfoAvailable = !!info &&
                             (!!info.careeR_SUMMARY ||
                              !!info.spequa ||
                              !!info.keywords);

        if (this.isInfoAvailable) {
          this.otherForm.patchValue({
            carSum: info.careeR_SUMMARY,
            specQuali: info.spequa,
            keyWord: info.keywords,
          });
        } else {
          this.otherForm.reset();
        }
      },
      error: err => {
        console.error('Failed to load other info', err);
        this.isInfoAvailable = false;
        this.otherForm.reset();
      }
    });
}


  private cleanValue(value: string | null): string {
    if (!value) return '';
    let cleaned = value.replace(/<p>\s*<\/p>/g, '');
    if (cleaned.match(/^<p>(.*?)<\/p>$/)) {
      cleaned = cleaned.replace(/^<p>(.*?)<\/p>$/, '$1');
    }
    return cleaned;
  }

  onSave(): void {
    if (this.otherForm.invalid) {
      this.otherForm.markAllAsTouched();
      return;
    }

    const payload: UpdateOtherRelevantInfo = {
      userGuid: this.UserGuid ?? '',
      career_Summary: this.cleanValue(this.carSumControl.value),
      special_Qualification: this.cleanValue(this.specQualiControl.value),
      keyWords: this.cleanValue(this.keywordsControl.value)
    };

    this.otherService.updateOtherInfo(payload).subscribe({
      next: () => this.isOtherFormOpen.set(false),
      error: err => console.error('Update failed', err)
    });
  }
}

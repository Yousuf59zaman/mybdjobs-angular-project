import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideTranslocoScope, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CreateAccountService } from '../../create-account/services/create-account.service';
import { BirthInfoService } from '../service/birth-info.service';
import { CookieService } from '../../../../core/services/cookie/cookie.service';
import { Router } from '@angular/router';
import { AddDateOfBirthRequest } from '../model/add-date-of-birth-request.model';
import { Dates, Months, Years } from '../model/date.const';

// Define form interface
interface BirthInfoForm {
  day: FormControl<string | null>;
  month: FormControl<string | null>;
  year: FormControl<string | null>;
  age: FormControl<string | null>;
}

@Component({
  selector: 'app-birth-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoDirective,
  ],
  providers: [provideTranslocoScope('birthInfo')],
  templateUrl: './birth-info.component.html',
  styleUrl: './birth-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BirthInfoComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private createAccountService = inject(CreateAccountService);
  private translocoService = inject(TranslocoService);
  private birthInfoService = inject(BirthInfoService);
  private router = inject(Router);
  private cookieService = inject(CookieService)
  // Form group
  formGroup = new FormGroup<BirthInfoForm>({
    day: new FormControl('', [Validators.required]),
    month: new FormControl('', [Validators.required]),
    year: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')])
  });

  currentLanguage = 'en';
  isBlueCollar = false
  isDisability = false
  guid : string ='';

  // Computed signals for form controls
  day = computed(() => this.formGroup.get('day') as FormControl<string>);
  month = computed(() => this.formGroup.get('month') as FormControl<string>);
  year = computed(() => this.formGroup.get('year') as FormControl<string>);
  age = computed(() => this.formGroup.get('age') as FormControl<string>);

  monthOptions = signal(Months);
  dayOptions = signal(Dates);
  yearOptions = signal(Years);


  ngOnInit() {
    // Get account type and set language
    const accountType = this.createAccountService.getAccountType();
      this.isBlueCollar = accountType === 'b';
      this.isDisability = accountType === 'd';

    if (this.isBlueCollar|| this.isDisability) {
      this.currentLanguage = 'en';
      this.translocoService.setActiveLang('en');
    }

    // Subscribe to language changes
    this.translocoService.langChanges$.subscribe((lang) => {
      this.currentLanguage = lang;
    });

    // Add custom validation for age and date of birth
    this.formGroup.setValidators(this.atLeastOneFieldValidator.bind(this));

    this.guid = decodeURIComponent(this.cookieService.getCookie('MybdjobsGId') as string);
  }

  private atLeastOneFieldValidator(): { [key: string]: boolean } | null {
    const day = this.formGroup.get('day')?.value;
    const month = this.formGroup.get('month')?.value;
    const year = this.formGroup.get('year')?.value;
    const age = this.formGroup.get('age')?.value;

    // Check if all date fields are empty
    const isDateOfBirthEmpty = !day && !month && !year;

    // If date of birth is filled, disable age validation
    if (!isDateOfBirthEmpty) {
      this.formGroup.get('age')?.clearValidators();
      this.formGroup.get('age')?.updateValueAndValidity();
    } else {
      this.formGroup.get('age')?.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
      this.formGroup.get('age')?.updateValueAndValidity();
    }

    // Trigger validation only if both fields are empty
    if (isDateOfBirthEmpty && !age) {
      return { atLeastOneRequired: true };
    }
    return null;
  }

  // Get error message for day
  getDayErrorMessage(control: FormControl): string {
    if (control.hasError('required')) {
      return 'Day is required';
    }
    return '';
  }

  // Get error message for month
  getMonthErrorMessage(control: FormControl): string {
    if (control.hasError('required')) {
      return 'Month is required';
    }
    return '';
  }

  // Get error message for year
  getYearErrorMessage(control: FormControl): string {
    if (control.hasError('required')) {
      return 'Year is required';
    }
    return '';
  }

  // Get error message for age
  getAgeErrorMessage(control: FormControl): string {
    if (control.hasError('required')) {
      return 'Age is required';
    }
    if (control.hasError('pattern')) {
      return 'Age must be an integer';
    }
    return '';
  }

  onSubmit(): void {
    if (this.formGroup.valid) {

      const acctype = this.createAccountService.getAccountType() || '';
      // const guid = 'Y7BhITZzPRdyZxS1BQ00Pic1MRc7BTLyZxYzYlJjPEBhBEc1BFPtBFUwZVkzSUZ=';
      const day = this.formGroup.get('day')?.value;
      const month = this.formGroup.get('month')?.value;
      const year = this.formGroup.get('year')?.value;
      const age = this.formGroup.get('age')?.value;

      const birthDate = day && month && year ? `${year}-${month}-${day}T00:00:00` : null;
      const ageNumber = !birthDate ? (age ? parseInt(age, 10) : 0) : 0;

      const request: AddDateOfBirthRequest = {
        UserGuidId: this.guid,
        BirthDate: birthDate || "",
        AgeNumber: ageNumber
      };

      this.birthInfoService.addDateOfBirth(request).subscribe({
        next: () => {

          if (acctype === 'd') {
            this.router.navigate(['create-account/physical-obstacle']);
          }else{
            this.router.navigate(['create-account/experience-info']);
          }

        },
        error: (err) => {
          alert('Error submitting date of birth or age. Please try again.');
        }
      });
    } else {
      // Mark all controls as touched to show validation messages
      Object.keys(this.formGroup.controls).forEach(key => {
        const control = this.formGroup.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}

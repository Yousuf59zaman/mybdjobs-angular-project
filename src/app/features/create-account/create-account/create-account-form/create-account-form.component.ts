import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, isDevMode, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { provideTranslocoScope, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ExperienceService } from '../../experience/service/experience.service';
import { SelectWorkingSkills, SkillCategory, SkillCategoryListResponse } from '../model/skill-category.model';
import { CreateAccountService, CheckDuplicateUserEventResponse, CreateAccountRequest } from '../services/create-account.service';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RadioComponent } from '../../../../shared/components/radio/radio.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { CheckboxComponent } from '../../../../shared/components/checkbox/checkbox.component';
import { CircularLoaderService } from '../../../../core/services/circularLoader/circular-loader.service';
import { ToastrService } from 'ngx-toastr';
import { InputTypeStyle } from '../../../../shared/enums/styles.enum';
import { NumericOnlyDirective } from '../../../../core/directives/numeric-only.dir';

// Define form interface
interface CreateAccountForm {
  name: FormControl<string | null>;
  gender: FormControl<string | null>;
  skill: FormControl<string | null>;
  email: FormControl<string | null>;
  countryCode: FormControl<string | null>;
  mobile: FormControl<string | null>;
  userIdType: FormControl<string | null>;
  password: FormControl<string | null>;
  retypePassword: FormControl<string | null>;
  captcha: FormControl<string | null>;
  termsAccepted: FormControl<boolean | null>;
  newsletter: FormControl<boolean | null>;
}

// Custom validator for password strength
const createPasswordStrengthValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]+/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !passwordValid ? { passwordStrength: true } : null;
  };
};

// Custom validator for password matching
const createPasswordMatchValidator = (passwordControl: AbstractControl): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = passwordControl.value;
    const confirmPassword = control.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
};

// Custom validator for mobile length
const createMobileLengthValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.length !== 11) {
      return { mobileLength: true };
    }

    return null;
  };
};

// Custom validator for name format
const createNameValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    // Check for maximum length
    if (value.length > 100) {
      return { maxLength: true };
    }

    // Check for valid characters using regex
    const nameRegex = /^[ A-Za-z\s./'-]*$/;
    if (!nameRegex.test(value)) {
      return { invalidFormat: true };
    }

    return null;
  };
};

@Component({
  selector: 'app-create-account-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RadioComponent,
    SelectComponent,
    CheckboxComponent,
    NumericOnlyDirective,
    TranslocoDirective
  ],
  providers: [provideTranslocoScope('createAccountForm')],
  templateUrl: './create-account-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAccountFormComponent implements OnInit, OnChanges {

  private destroyRef = inject(DestroyRef);
  private skillCategoryService = inject(ExperienceService);
  private createAccountService = inject(CreateAccountService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loadr = inject(CircularLoaderService);
  private toastr = inject(ToastrService);
  private translocoService = inject(TranslocoService);

  skillCategories = signal<SkillCategory[]>([]);
  selectWorkingSkills = signal<SelectWorkingSkills[]>([]);
  message: string = '';
  duplicateCheckMessage = signal<string | null>(null);
  showDuplicatePopup = signal<boolean>(false);
  duplicatePopupMessage = signal<string>('');
  emailRadioError = signal<string>('');
  mobileRadioError = signal<string>('');
  inputFieldStyles = InputTypeStyle;
  activeLanguage = signal('');
  // Form group
  formGroup = new FormGroup<CreateAccountForm & { disabilityId: FormControl<string | null> }>({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      createNameValidator()
    ]),
    gender: new FormControl('', [Validators.required]),
    skill: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
    countryCode: new FormControl('+88', [Validators.required]),
    mobile: new FormControl('', [Validators.required, createMobileLengthValidator()]),
    userIdType: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(12),
      createPasswordStrengthValidator()
    ]),
    retypePassword: new FormControl('', [Validators.required]),
    captcha: new FormControl('', [Validators.required]),
    termsAccepted: new FormControl<boolean | null>(false, [Validators.requiredTrue]),
    newsletter: new FormControl<boolean | null>(false),
    disabilityId: new FormControl('', []) // required only for disability mode
  });

  // Add these properties to your component class
  captchaNum1 = 0;
  captchaNum2 = 0;
  captchaError: string | null = null;
  currentLanguage = 'en';
  isBlueCollar = false;
  isDisability = false;

  constructor() {

    this.name().valueChanges.subscribe(() => { this.getNameErrorMessage(); })

    this.translocoService.langChanges$.subscribe((lang) => {
      this.currentLanguage = lang;
    });

    // Add password match validator
    const passwordControl = this.formGroup.get('password');
    if (passwordControl) {
      this.formGroup.get('retypePassword')?.addValidators(
        createPasswordMatchValidator(passwordControl)
      );
    }

    // Subscribe to password changes to update strength indicator
    passwordControl?.valueChanges.subscribe(value => {
      this.updatePasswordStrength(value);
    });

    // Subscribe to form validity changes
    // this.formGroup.statusChanges.subscribe(status => {
    //   console.log('Form status:', status);
    // });
  }
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit() {
    // Read query param
    this.route.queryParamMap.subscribe(params => {
      const type = params.get('type');
      this.isBlueCollar = type === 'b';
      this.isDisability = type === 'd';
      if (this.isBlueCollar || this.isDisability) {
        this.currentLanguage = 'bn';
        this.translocoService.setActiveLang('bn');
      }
      // Set validators dynamically based on type
      this.setValidatorsByType();
      this.loadSkillCategories();
      // Store account type in service
      this.createAccountService.setAccountType(type || 'w');
    });
    this.generateCaptcha();
    this.setupUserIdTypeListener();
    this.translocoService.langChanges$.subscribe((val) => {
      this.activeLanguage.set(val);
      // this.loadSkillCategories();
      // console.log('val', val);
    })
  }

  setValidatorsByType() {
    // Helper to set validators for each field based on account type
    // Name, Gender, Skill, Mobile always required
    this.formGroup.get('name')?.setValidators([Validators.required, Validators.maxLength(100), createNameValidator()]);
    this.formGroup.get('gender')?.setValidators([Validators.required]);
    this.formGroup.get('skill')?.setValidators([Validators.required]);
    this.formGroup.get('mobile')?.setValidators([Validators.required, createMobileLengthValidator()]);

    this.formGroup.get('email')?.clearValidators();
    this.formGroup.get('userIdType')?.clearValidators();
    this.formGroup.get('password')?.clearValidators();
    this.formGroup.get('retypePassword')?.clearValidators();
    this.formGroup.get('captcha')?.clearValidators();
    this.formGroup.get('termsAccepted')?.clearValidators();
    this.formGroup.get('newsletter')?.clearValidators();

    if (this.isBlueCollar) {
      this.formGroup.get('disabilityId')?.clearValidators();
    } else if (this.isDisability) {
      this.formGroup.get('disabilityId')?.setValidators([Validators.required]);
    } else {
      this.formGroup.get('email')?.setValidators([Validators.required, Validators.email, Validators.maxLength(50)]);
      this.formGroup.get('userIdType')?.setValidators([Validators.required]);
      this.formGroup.get('password')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(12), createPasswordStrengthValidator()]);
      const passwordControl = this.formGroup.get('password');
      if (passwordControl) {
        this.formGroup.get('retypePassword')?.setValidators([Validators.required, createPasswordMatchValidator(passwordControl)]);
      } else {
        this.formGroup.get('retypePassword')?.setValidators([Validators.required]);
      }
      this.formGroup.get('captcha')?.setValidators([Validators.required]);
      this.formGroup.get('termsAccepted')?.setValidators([Validators.requiredTrue]);
      this.formGroup.get('newsletter')?.clearValidators();
      this.formGroup.get('disabilityId')?.clearValidators();
    }
    // Always update validity after changing validators
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key)?.updateValueAndValidity();
    });
  }

  get passwordControl(): FormControl<string | null> {
    return this.formGroup.get('password') as FormControl<string | null>;
  }

  getStrengthLevel(): number {
    const length = this.passwordControl.value?.length || 0;
    if (length > 9) return 3;
    if (length >= 6) return 2;
    if (length > 0) return 1;
    return 0;
  }

  getBarColor(level: number): string {
    return this.getStrengthLevel() >= level
      ? level === 3
        ? 'bg-[#81c784]' // Strong
        : level === 2
        ? 'bg-[#ff3c00]' // Medium
        : 'bg-[#dd2c00]' // Weak
      : 'bg-[#ccc]'; // Default
  }

  // Password strength indicator
  private updatePasswordStrength(password: string | null): void {
    if (!password) {
      this.hidePasswordStrength();
      return;
    }

    const progressBar = document.getElementById('progress');
    const progressBarInner = document.getElementById('progressbar');
    const strengthMessage = document.getElementById('PasswordStrength_message');

    if (progressBar && progressBarInner && strengthMessage) {
      progressBar.classList.remove('hidden');

      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[A-Z]+/.test(password)) strength += 25;
      if (/[0-9]+/.test(password)) strength += 25;
      if (/[!@#$%^&*(),.?":{}|<>]+/.test(password)) strength += 25;

      progressBarInner.style.width = `${strength}%`;

      if (strength < 50) {
        progressBarInner.classList.remove('bg-green-500', 'bg-yellow-500');
        progressBarInner.classList.add('bg-red-500');
        strengthMessage.textContent = 'Weak password';
      } else if (strength < 100) {
        progressBarInner.classList.remove('bg-red-500', 'bg-green-500');
        progressBarInner.classList.add('bg-yellow-500');
        strengthMessage.textContent = 'Medium strength password';
      } else {
        progressBarInner.classList.remove('bg-red-500', 'bg-yellow-500');
        progressBarInner.classList.add('bg-green-500');
        strengthMessage.textContent = 'Strong password';
      }

      strengthMessage.classList.remove('hidden');
    }
  }

  private hidePasswordStrength(): void {
    const progressBar = document.getElementById('progress');
    const strengthMessage = document.getElementById('PasswordStrength_message');

    if (progressBar && strengthMessage) {
      progressBar.classList.add('hidden');
      strengthMessage.classList.add('hidden');
    }
  }

  getNameErrorMessage(): string {
    if (this.name().hasError('required')) {
      return 'createAccountForm.nameErrorRequired';
    }
    if (this.name().hasError('maxLength')) {
      return 'createAccountForm.nameErrorLaxLength';
    }
    if (this.name().hasError('invalidFormat')) {
      return 'createAccountForm.nameErrorInvalidFormat';
    }
    return '';
  }
  // Get error messages for password
  getPasswordErrorMessage(): string {
    if (this.password().hasError('required')) {
      return 'createAccountForm.passwordErrorRequired';
    }
    if (this.password().hasError('minlength')) {
      return 'createAccountForm.passwordErrorMinLength';
    }
    if (this.password().hasError('maxlength')) {
      return 'createAccountForm.passwordErrorMaxLength';
    }
    if (this.password().hasError('passwordStrength')) {
      return 'createAccountForm.passwordErrorStrength';
    }
    return '';
  }

  // Get error message for retype password
  getRetypePasswordErrorMessage(): string {
    if (this.retypePassword().value !== this.password().value) {
      return 'createAccountForm.retypePasswordErrorRequired';
    }
    if (this.retypePassword().hasError('required')) {
      return 'createAccountForm.retypePasswordErrorMatch';
    }
    return '';
  }

  // Get error message for mobile
  getMobileErrorMessage(): string {
    if (this.mobile().hasError('required')) {
      return 'createAccountForm.mobileErrorRequired';
    }
    if (this.mobile().hasError('mobileLength')) {
      return 'createAccountForm.mobileErrorLength';
    }
    if(this.mobile().hasError('invalidFormat')){
      return 'createAccountForm.mobileErrorInvalidFormat';
    }
    return '';
  }

  // Get error message for email
  getEmailErrorMessage(): string {
    if (this.email().hasError('required')) {
      return 'createAccountForm.emailErrorRequired';
    }
    if (this.email().hasError('email')) {
      return 'createAccountForm.emailErrorValid';
    }
    if (this.email().hasError('maxlength')) {
      return 'createAccountForm.emailErrorMaxLength';
    }
    return '';
  }

  // Computed signals for form controls
  name = computed(() => this.formGroup.get('name') as FormControl<string>);
  gender = computed(() => this.formGroup.get('gender') as FormControl<string>);
  skill = computed(() => this.formGroup.get('skill') as FormControl<string>);
  email = computed(() => this.formGroup.get('email') as FormControl<string>);
  countryCode = computed(() => this.formGroup.get('countryCode') as FormControl<string>);
  mobile = computed(() => this.formGroup.get('mobile') as FormControl<string>);
  userIdType = computed(() => this.formGroup.get('userIdType') as FormControl<string>);
  password = computed(() => this.formGroup.get('password') as FormControl<string>);
  retypePassword = computed(() => this.formGroup.get('retypePassword') as FormControl<string>);
  termsAccepted = computed(() => this.formGroup.get('termsAccepted') as FormControl<boolean>);
  newsletter = computed(() => this.formGroup.get('newsletter') as FormControl<boolean>);
  captcha = computed(() => this.formGroup.get('captcha') as FormControl<string>);
  disabilityId = () => this.formGroup.get('disabilityId') as FormControl<string | null>;

  // Radio items for gender
  genderRadioItems = [
    { id: 'M', name: 'gender', label: 'Male', icon: 'icon-gender-male' },
    { id: 'F', name: 'gender', label: 'Female', icon: 'icon-gender-female' },
    { id: 'O', name: 'gender', label: 'Others', icon: 'icon-gender-others' }
  ];


// Radio items for user ID type
userIdTypeRadioItems = [
  { id: 'email', name: 'userIdType', label: 'Email', icon: 'icon-envelope', class: 'block mb-2' },
  { id: 'mobile', name: 'userIdType', label: 'Mobile', icon: 'icon-smart-phone', class: 'block' }
];

  // Country code options for dropdown
  countryCodeOptions = [
    { value: '93', label: 'Afghanistan (93)', bnLabel: 'আফগানিস্তান (৯৩)' },
    { value: '355', label: 'Albania (355)', bnLabel: 'আলবেনিয়া (৩৫৫)' },
    { value: '213', label: 'Algeria (213)', bnLabel: 'আলজেরিয়া (২১৩)' },
    { value: '376', label: 'Andorra (376)', bnLabel: 'অ্যান্ডোরা (৩৭৬)' },
    { value: '244', label: 'Angola (244)', bnLabel: 'অ্যাঙ্গোলা (২৪৪)' },
    { value: '264', label: 'Anguilla (264)', bnLabel: 'অ্যাঙ্গুইলা (২৬৪)' },
    { value: '672', label: 'Antarctica (672)', bnLabel: 'অ্যান্টার্কটিকা (৬৭২)' },
    { value: '268', label: 'Antigua (268)', bnLabel: 'অ্যান্টিগুয়া (২৬৮)' },
    { value: '54', label: 'Argentina (54)', bnLabel: 'আর্জেন্টিনা (৫৪)' },
    { value: '374', label: 'Armenia (374)', bnLabel: 'আর্মেনিয়া (৩৭৪)' },
    { value: '297', label: 'Aruba (297)', bnLabel: 'আরুবা (২৯৭)' },
    { value: '61', label: 'Australia (61)', bnLabel: 'অস্ট্রেলিয়া (৬১)' },
    { value: '43', label: 'Austria (43)', bnLabel: 'অস্ট্রিয়া (৪৩)' },
    { value: '994', label: 'Azerbaijan (994)', bnLabel: 'আজারবাইজান (৯৯৪)' },
    { value: '242', label: 'Bahamas (242)', bnLabel: 'বাহামা (২৪২)' },
    { value: '973', label: 'Bahrain (973)', bnLabel: 'বাহরাইন (৯৭৩)' },
    { value: '+88', label: 'Bangladesh (88)', bnLabel: 'বাংলাদেশ (৮৮)' },
    { value: '246', label: 'Barbados (246)', bnLabel: 'বার্বাডোস (২৪৬)' },
    { value: '375', label: 'Belarus (375)', bnLabel: 'বেলারুশ (৩৭৫)' },
    { value: '32', label: 'Belgium (32)', bnLabel: 'বেলজিয়াম (৩২)' },
    { value: '501', label: 'Belize (501)', bnLabel: 'বেলিজ (৫০১)' },
    { value: '229', label: 'Benin (229)', bnLabel: 'বেনিন (২২৯)' },
    { value: '441', label: 'Bermuda (441)', bnLabel: 'বারমুডা (৪৪১)' },
    { value: '975', label: 'Bhutan (975)', bnLabel: 'ভুটান (৯৭৫)' },
    { value: '591', label: 'Bolivia (591)', bnLabel: 'বলিভিয়া (৫৯১)' },
    { value: '387', label: 'Bosnia and Herzegovina (387)', bnLabel: 'বসনিয়া এবং হার্জেগোভিনা (৩৮৭)' },
    { value: '267', label: 'Botswana (267)', bnLabel: 'বতসোয়ানা (২৬৭)' },
    { value: '55', label: 'Brazil (55)', bnLabel: 'ব্রাজিল (৫৫)' },
    { value: '284', label: 'British Virgin Islands (284)', bnLabel: 'ব্রিটিশ ভার্জিন দ্বীপপুঞ্জ (২৮৪)' },
    { value: '673', label: 'Brunei (673)', bnLabel: 'ব্রুনেই (৬৭৩)' },
    { value: '359', label: 'Bulgaria (359)', bnLabel: 'বুলগেরিয়া (৩৫৯)' },
    { value: '226', label: 'Burkina Faso (226)', bnLabel: 'বুরকিনা ফাসো (২২৬)' },
    { value: '257', label: 'Burundi (257)', bnLabel: 'বুরুন্ডি (২৫৭)' },
    { value: '855', label: 'Cambodia (855)', bnLabel: 'কাম্বোডিয়া (৮৫৫)' },
    { value: '237', label: 'Cameroon (237)', bnLabel: 'ক্যামেরুন (২৩৭)' },
    { value: '1', label: 'Canada (1)', bnLabel: 'কানাডা (১)' },
    { value: '238', label: 'Cape Verde (238)', bnLabel: 'কেপ ভার্দে (২৩৮)' },
    { value: '236', label: 'Central African Republic (236)', bnLabel: 'মধ্য আফ্রিকান প্রজাতন্ত্র (২৩৬)' },
    { value: '235', label: 'Chad (235)', bnLabel: 'চাদ (২৩৫)' },
    { value: '56', label: 'Chile (56)', bnLabel: 'চিলি (৫৬)' },
    { value: '86', label: 'China (86)', bnLabel: 'চীন (৮৬)' },
    { value: '57', label: 'Colombia (57)', bnLabel: 'কলম্বিয়া (৫৭)' },
    { value: '269', label: 'Comoros (269)', bnLabel: 'কমোরোস (২৬৯)' },
    { value: '242', label: 'Congo (242)', bnLabel: 'কঙ্গো (২৪২)' },
    { value: '243', label: 'Congo (Zaire) (243)', bnLabel: 'কঙ্গো (জাইরে) (২৪৩)' },
    { value: '682', label: 'Cook Islands (682)', bnLabel: 'কুক দ্বীপপুঞ্জ (৬৮২)' },
    { value: '506', label: 'Costa Rica (506)', bnLabel: 'কোস্টারিকা (৫০৬)' },
    { value: '225', label: "Cote d'Ivoire (Ivory Coast) (225)", bnLabel: 'আইভরি কোস্ট (কোত দিভোয়ার) (২২৫)' },
    { value: '385', label: 'Croatia (385)', bnLabel: 'ক্রোয়েশিয়া (৩৮৫)' },
    { value: '53', label: 'Cuba (53)', bnLabel: 'কিউবা (৫৩)' },
    { value: '357', label: 'Cyprus (357)', bnLabel: 'সাইপ্রাস (৩৫৭)' },
    { value: '420', label: 'Czech Republic (420)', bnLabel: 'চেক প্রজাতন্ত্র (৪২০)' },
    { value: '45', label: 'Denmark (45)', bnLabel: 'ডেনমার্ক (৪৫)' },
    { value: '253', label: 'Djibouti (253)', bnLabel: 'জিবুতি (২৫৩)' },
    { value: '767', label: 'Dominica (767)', bnLabel: 'ডোমিনিকা (৭৬৭)' },
    { value: '809', label: 'Dominican Republic (809)', bnLabel: 'ডোমিনিকান প্রজাতন্ত্র (৮০৯)' },
    { value: '670', label: 'East Timor (670)', bnLabel: 'পূর্ব তিমুর (৬৭০)' },
    { value: '593', label: 'Ecuador (593)', bnLabel: 'ইকুয়েডর (৫৯৩)' },
    { value: '20', label: 'Egypt (20)', bnLabel: 'মিশর (২০)' },
    { value: '503', label: 'El Salvador (503)', bnLabel: 'এল সালভাদর (৫০৩)' },
    { value: '240', label: 'Equatorial Guinea (240)', bnLabel: 'ইকুয়েটোরিয়াল গিনি (২৪০)' },
    { value: '291', label: 'Eritrea (291)', bnLabel: 'এরিত্রিয়া (২৯১)' },
    { value: '372', label: 'Estonia (372)', bnLabel: 'এস্তোনিয়া (৩৭২)' },
    { value: '251', label: 'Ethiopia (251)', bnLabel: 'ইথিওপিয়া (২৫১)' },
    { value: '500', label: 'Falkland Islands (500)', bnLabel: 'ফকল্যান্ড দ্বীপপুঞ্জ (৫০০)' },
    { value: '691', label: 'Federated States of Micronesia (691)', bnLabel: 'মাইক্রোনেশিয়া (৬৯১)' },
    { value: '679', label: 'Fiji (679)', bnLabel: 'ফিজি (৬৭৯)' },
    { value: '358', label: 'Finland (358)', bnLabel: 'ফিনল্যান্ড (৩৫৮)' },
    { value: '33', label: 'France (33)', bnLabel: 'ফ্রান্স (৩৩)' },
    { value: '594', label: 'French Guiana (594)', bnLabel: 'ফরাসি গিয়ানা (৫৯৪)' },
    { value: '689', label: 'French Polynesia (689)', bnLabel: 'ফরাসি পলিনেশিয়া (৬৮৯)' },
    { value: '241', label: 'Gabon (241)', bnLabel: 'গ্যাবন (২৪১)' },
    { value: '995', label: 'Georgia (995)', bnLabel: 'জর্জিয়া (৯৯৫)' },
    { value: '49', label: 'Germany (49)', bnLabel: 'জার্মানি (৪৯)' },
    { value: '233', label: 'Ghana (233)', bnLabel: 'ঘানা (২৩৩)' },
    { value: '350', label: 'Gibraltar (350)', bnLabel: 'জিব্রাল্টার (৩৫০)' },
    { value: '30', label: 'Greece (30)', bnLabel: 'গ্রিস (৩০)' },
    { value: '299', label: 'Greenland (299)', bnLabel: 'গ্রীনল্যান্ড (২৯৯)' },
    { value: '473', label: 'Grenada (473)', bnLabel: 'গ্রেনাডা (৪৭৩)' },
    { value: '590', label: 'Guadeloupe (590)', bnLabel: 'গুয়াডেলোপ (৫৯০)' },
    { value: '502', label: 'Guatemala (502)', bnLabel: 'গুয়াতেমালা (৫০২)' },
    { value: '224', label: 'Guinea (224)', bnLabel: 'গিনি (২২৪)' },
    { value: '245', label: 'Guinea-Bissau (245)', bnLabel: 'গিনি-বিসাউ (২৪৫)' },
    { value: '592', label: 'Guyana (592)', bnLabel: 'গায়ানা (৫৯২)' },
    { value: '509', label: 'Haiti (509)', bnLabel: 'হাইতি (৫০৯)' },
    { value: '504', label: 'Honduras (504)', bnLabel: 'হন্ডুরাস (৫০৪)' },
    { value: '852', label: 'Hong Kong (852)', bnLabel: 'হংকং (৮৫২)' },
    { value: '36', label: 'Hungary (36)', bnLabel: 'হাঙ্গেরি (৩৬)' },
    { value: '354', label: 'Iceland (354)', bnLabel: 'আইসল্যান্ড (৩৫৪)' },
    { value: '91', label: 'India (91)', bnLabel: 'ভারত (৯১)' },
    { value: '62', label: 'Indonesia (62)', bnLabel: 'ইন্দোনেশিয়া (৬২)' },
    { value: '98', label: 'Iran (98)', bnLabel: 'ইরান (৯৮)' },
    { value: '964', label: 'Iraq (964)', bnLabel: 'ইরাক (৯৬৪)' },
    { value: '353', label: 'Ireland (353)', bnLabel: 'আয়ারল্যান্ড (৩৫৩)' },
    { value: '972', label: 'Israel (972)', bnLabel: 'ইসরায়েল (৯৭২)' },
    { value: '39', label: 'Italy (39)', bnLabel: 'ইতালি (৩৯)' },
    { value: '876', label: 'Jamaica (876)', bnLabel: 'জামাইকা (৮৭৬)' },
    { value: '81', label: 'Japan (81)', bnLabel: 'জাপান (৮১)' },
    { value: '962', label: 'Jordan (962)', bnLabel: 'জর্ডান (৯৬২)' },
    { value: '7', label: 'Kazakhstan (7)', bnLabel: 'কাজাখস্তান (৭)' },
    { value: '254', label: 'Kenya (254)', bnLabel: 'কেনিয়া (২৫৪)' },
    { value: '686', label: 'Kiribati (686)', bnLabel: 'কিরিবাতি (৬৮৬)' },
    { value: '965', label: 'Kuwait (965)', bnLabel: 'কুয়েত (৯৬৫)' },
    { value: '996', label: 'Kyrgyzstan (996)', bnLabel: 'কিরগিজস্তান (৯৯৬)' },
    { value: '856', label: 'Laos (856)', bnLabel: 'লাওস (৮৫৬)' },
    { value: '371', label: 'Latvia (371)', bnLabel: 'লাটভিয়া (৩৭১)' },
    { value: '961', label: 'Lebanon (961)', bnLabel: 'লেবানন (৯৬১)' },
    { value: '266', label: 'Lesotho (266)', bnLabel: 'লেসোথো (২৬৬)' },
    { value: '231', label: 'Liberia (231)', bnLabel: 'লাইবেরিয়া (২৩১)' },
    { value: '218', label: 'Libya (218)', bnLabel: 'লিবিয়া (২১৮)' },
    { value: '423', label: 'Liechtenstein (423)', bnLabel: 'লিচেনস্টেইন (৪২৩)' },
    { value: '370', label: 'Lithuania (370)', bnLabel: 'লিথুয়ানিয়া (৩৭০)' },
    { value: '352', label: 'Luxembourg (352)', bnLabel: 'লাক্সেমবার্গ (৩৫২)' },
    { value: '853', label: 'Macau (853)', bnLabel: 'ম্যাকাও (৮৫৩)' },
    { value: '389', label: 'Macedonia (389)', bnLabel: 'ম্যাসেডোনিয়া (৩৮৯)' },
    { value: '261', label: 'Madagascar (261)', bnLabel: 'মাদাগাস্কার (২৬১)' },
    { value: '265', label: 'Malawi (265)', bnLabel: 'মালাউই (২৬৫)' },
    { value: '60', label: 'Malaysia (60)', bnLabel: 'মালয়েশিয়া (৬০)' },
    { value: '960', label: 'Maldives (960)', bnLabel: 'মালদ্বীপ (৯৬০)' },
    { value: '223', label: 'Mali (223)', bnLabel: 'মালি (২২৩)' },
    { value: '356', label: 'Malta (356)', bnLabel: 'মাল্টা (৩৫৬)' },
    { value: '692', label: 'Marshall Islands (692)', bnLabel: 'মার্শাল দ্বীপপুঞ্জ (৬৯২)' },
    { value: '596', label: 'Martinique (596)', bnLabel: 'মার্টিনিক (৫৯৬)' },
    { value: '222', label: 'Mauritania (222)', bnLabel: 'মরিতানিয়া (২২২)' },
    { value: '230', label: 'Mauritius (230)', bnLabel: 'মরিশাস (২৩০)' },
    { value: '262', label: 'Mayotte (262)', bnLabel: 'মায়োটি (২৬২)' },
    { value: '52', label: 'Mexico (52)', bnLabel: 'মেক্সিকো (৫২)' },
    { value: '373', label: 'Moldova (373)', bnLabel: 'মলডোভা (৩৭৩)' },
    { value: '377', label: 'Monaco (377)', bnLabel: 'মোনাকো (৩৭৭)' },
    { value: '976', label: 'Mongolia (976)', bnLabel: 'মঙ্গোলিয়া (৯৭৬)' },
    { value: '382', label: 'Montenegro (382)', bnLabel: 'মন্টেনেগ্রো (৩৮২)' },
    { value: '664', label: 'Montserrat (664)', bnLabel: 'মন্টসেরাট (৬৬৪)' },
    { value: '212', label: 'Morocco (212)', bnLabel: 'মরক্কো (২১২)' },
    { value: '258', label: 'Mozambique (258)', bnLabel: 'মোজাম্বিক (২৫৮)' },
    { value: '95', label: 'Myanmar (95)', bnLabel: 'মিয়ানমার (৯৫)' },
    { value: '264', label: 'Namibia (264)', bnLabel: 'নামিবিয়া (২৬৪)' },
    { value: '674', label: 'Nauru (674)', bnLabel: 'নাউরু (৬৭৪)' },
    { value: '977', label: 'Nepal (977)', bnLabel: 'নেপাল (৯৭৭)' },
    { value: '31', label: 'Netherlands (31)', bnLabel: 'নেদারল্যান্ডস (৩১)' },
    { value: '599', label: 'Netherlands Antilles (599)', bnLabel: 'নেদারল্যান্ডস অ্যান্টিলিস (৫৯৯)' },
    { value: '687', label: 'New Caledonia (687)', bnLabel: 'নিউ ক্যালেডোনিয়া (৬৮৭)' },
    { value: '64', label: 'New Zealand (64)', bnLabel: 'নিউজিল্যান্ড (৬৪)' },
    { value: '505', label: 'Nicaragua (505)', bnLabel: 'নিকারাগুয়া (৫০৫)' },
    { value: '227', label: 'Niger (227)', bnLabel: 'নাইজার (২২৭)' },
    { value: '234', label: 'Nigeria (234)', bnLabel: 'নাইজেরিয়া (২৩৪)' },
    { value: '850', label: 'North Korea (850)', bnLabel: 'উত্তর কোরিয়া (৮৫০)' },
    { value: '47', label: 'Norway (47)', bnLabel: 'নরওয়ে (৪৭)' },
    { value: '968', label: 'Oman (968)', bnLabel: 'ওমান (৯৬৮)' },
    { value: '92', label: 'Pakistan (92)', bnLabel: 'পাকিস্তান (৯২)' },
    { value: '680', label: 'Palau (680)', bnLabel: 'পালাউ (৬৮০)' },
    { value: '507', label: 'Panama (507)', bnLabel: 'পানামা (৫০৭)' },
    { value: '675', label: 'Papua New Guinea (675)', bnLabel: 'পাপুয়া নিউ গিনি (৬৭৫)' },
    { value: '595', label: 'Paraguay (595)', bnLabel: 'প্যারাগুয়ে (৫৯৫)' },
    { value: '51', label: 'Peru (51)', bnLabel: 'পেরু (৫১)' },
    { value: '63', label: 'Philippines (63)', bnLabel: 'ফিলিপাইন (৬৩)' },
    { value: '48', label: 'Poland (48)', bnLabel: 'পোল্যান্ড (৪৮)' },
    { value: '351', label: 'Portugal (351)', bnLabel: 'পর্তুগাল (৩৫১)' },
    { value: '974', label: 'Qatar (974)', bnLabel: 'কাতার (৯৭৪)' },
    { value: '383', label: 'Republic of Kosovo (383)', bnLabel: 'কসোভো প্রজাতন্ত্র (৩৮৩)' },
    { value: '40', label: 'Romania (40)', bnLabel: 'রোমানিয়া (৪০)' },
    { value: '7', label: 'Russia (7)', bnLabel: 'রাশিয়া (৭)' },
    { value: '250', label: 'Rwanda (250)', bnLabel: 'রুয়ান্ডা (২৫০)' },
    { value: '869', label: 'Saint Kitts and Nevis (869)', bnLabel: 'সেন্ট কিটস ও নেভিস (৮৬৯)' },
    { value: '758', label: 'Saint Lucia (758)', bnLabel: 'সেন্ট লুসিয়া (৭৫৮)' },
    { value: '508', label: 'Saint Pierre and Miquelon (508)', bnLabel: 'সেন্ট পিয়েরে ও মিকেলন (৫০৮)' },
    { value: '784', label: 'Saint Vincent and the Grenadines (784)', bnLabel: 'সেন্ট ভিনসেন্ট ও দ্য গ্রেনাডিনস (৭৮৪)' },
    { value: '685', label: 'Samoa (685)', bnLabel: 'সামোয়া (৬৮৫)' },
    { value: '378', label: 'San Marino (378)', bnLabel: 'সান মারিনো (৩৭৮)' },
    { value: '239', label: 'Sao Tome and Principe (239)', bnLabel: 'সাও টোমে ও প্রিন্সিপে (২৩৯)' },
    { value: '966', label: 'Saudi Arabia (966)', bnLabel: 'সৌদি আরব (৯৬৬)' },
    { value: '221', label: 'Senegal (221)', bnLabel: 'সেনেগাল (২২১)' },
    { value: '381', label: 'Serbia (381)', bnLabel: 'সার্বিয়া (৩৮১)' },
    { value: '248', label: 'Seychelles (248)', bnLabel: 'সেশেলস (২৪৮)' },
    { value: '232', label: 'Sierra Leone (232)', bnLabel: 'সিয়েরা লিওন (২৩২)' },
    { value: '65', label: 'Singapore (65)', bnLabel: 'সিঙ্গাপুর (৬৫)' },
    { value: '421', label: 'Slovakia (421)', bnLabel: 'স্লোভাকিয়া (৪২১)' },
    { value: '386', label: 'Slovenia (386)', bnLabel: 'স্লোভেনিয়া (৩৮৬)' },
    { value: '677', label: 'Solomon Islands (677)', bnLabel: 'সলোমন দ্বীপপুঞ্জ (৬৭৭)' },
    { value: '252', label: 'Somalia (252)', bnLabel: 'সোমালিয়া (২৫২)' },
    { value: '27', label: 'South Africa (27)', bnLabel: 'দক্ষিণ আফ্রিকা (২৭)' },
    { value: '82', label: 'South Korea (82)', bnLabel: 'দক্ষিণ কোরিয়া (৮২)' },
    { value: '2011', label: 'South Sudan (2011)', bnLabel: 'দক্ষিণ সুদান (২০১১)' },
    { value: '34', label: 'Spain (34)', bnLabel: 'স্পেন (৩৪)' },
    { value: '94', label: 'Sri Lanka (94)', bnLabel: 'শ্রীলঙ্কা (৯৪)' },
    { value: '249', label: 'Sudan (249)', bnLabel: 'সুদান (২৪৯)' },
    { value: '597', label: 'Suriname (597)', bnLabel: 'সুরিনাম (৫৯৭)' },
    { value: '268', label: 'Swaziland (268)', bnLabel: 'সোয়াজিল্যান্ড (২৬৮)' },
    { value: '46', label: 'Sweden (46)', bnLabel: 'সুইডেন (৪৬)' },
    { value: '41', label: 'Switzerland (41)', bnLabel: 'সুইজারল্যান্ড (৪১)' },
    { value: '963', label: 'Syria (963)', bnLabel: 'সিরিয়া (৯৬৩)' },
    { value: '886', label: 'Taiwan (886)', bnLabel: 'তাইওয়ান (৮৮৬)' },
    { value: '992', label: 'Tajikistan (992)', bnLabel: 'তাজিকিস্তান (৯৯২)' },
    { value: '255', label: 'Tanzania (255)', bnLabel: 'তানজানিয়া (২৫৫)' },
    { value: '66', label: 'Thailand (66)', bnLabel: 'থাইল্যান্ড (৬৬)' },
    { value: '220', label: 'The Gambia (220)', bnLabel: 'গাম্বিয়া (২২০)' },
    { value: '228', label: 'Togo (228)', bnLabel: 'টোগো (২২৮)' },
    { value: '676', label: 'Tonga (676)', bnLabel: 'টোঙ্গা (৬৭৬)' },
    { value: '868', label: 'Trinidad and Tobago (868)', bnLabel: 'ত্রিনিদাদ ও টোবাগো (৮৬৮)' },
    { value: '216', label: 'Tunisia (216)', bnLabel: 'তিউনিসিয়া (২১৬)' },
    { value: '90', label: 'Turkey (90)', bnLabel: 'তুরস্ক (৯০)' },
    { value: '993', label: 'Turkmenistan (993)', bnLabel: 'তুর্কমেনিস্তান (৯৯৩)' },
    { value: '649', label: 'Turks and Caicos Islands (649)', bnLabel: 'টার্কস ও কাইকোস দ্বীপপুঞ্জ (৬৪৯)' },
    { value: '688', label: 'Tuvalu (688)', bnLabel: 'টুভালু (৬৮৮)' },
    { value: '256', label: 'Uganda (256)', bnLabel: 'উগান্ডা (২৫৬)' },
    { value: '380', label: 'Ukraine (380)', bnLabel: 'ইউক্রেন (৩৮০)' },
    { value: '971', label: 'United Arab Emirates (971)', bnLabel: 'সংযুক্ত আরব আমিরাত (৯৭১)' },
    { value: '44', label: 'United Kingdom (44)', bnLabel: 'যুক্তরাজ্য (৪৪)' },
    { value: '1', label: 'United States (1)', bnLabel: 'যুক্তরাষ্ট্র (১)' },
    { value: '598', label: 'Uruguay (598)', bnLabel: 'উরুগুয়ে (৫৯৮)' },
    { value: '998', label: 'Uzbekistan (998)', bnLabel: 'উজবেকিস্তান (৯৯৮)' },
    { value: '678', label: 'Vanuatu (678)', bnLabel: 'ভানুয়াতু (৬৭৮)' },
    { value: '58', label: 'Venezuela (58)', bnLabel: 'ভেনেজুয়েলা (৫৮)' },
    { value: '84', label: 'Vietnam (84)', bnLabel: 'ভিয়েতনাম (৮৪)' },
    { value: '967', label: 'Yemen (967)', bnLabel: 'ইয়েমেন (৯৬৭)' },
    { value: '260', label: 'Zambia (260)', bnLabel: 'জাম্বিয়া (২৬০)' },
    { value: '263', label: 'Zimbabwe (263)', bnLabel: 'জিম্বাবুয়ে (২৬৩)' }
  ];

  selectedCountryCode = '+88'; // Default value for dropdown binding

  // Method to generate new captcha numbers
  generateCaptcha() {
    this.captchaNum1 = Math.floor(Math.random() * 10) + 1;
    this.captchaNum2 = Math.floor(Math.random() * 10) + 1;
    this.captchaError = null;
    this.formGroup.get('captcha')?.setValue('');
  }

  // Method to validate captcha
  validateCaptcha() {
    const answer = Number(this.formGroup.get('captcha')?.value);
    if (answer !== this.captchaNum1 + this.captchaNum2) {
      this.captchaError = 'Incorrect value';
      return false;
    }
    this.captchaError = null;
    return true;
  }

  // Update your onSubmit to check captcha before proceeding
  onSubmit(): void {
    // Validate captcha first

    if(!this.isBlueCollar && !this.isDisability){
      if (!this.validateCaptcha()) {
        this.formGroup.get('captcha')?.setErrors({ incorrect: true });
      }
    } else {
      this.termsAccepted().setValue(true);
    }

    if (this.formGroup.valid) {
      this.loadr.setLoading(true);
      let payload = this.generatePayload();

      this.createAccountService.setUserNameType(payload.userNameType);
      this.createAccountService.createAccount(payload)
        .pipe(
          finalize(() => this.loadr.setLoading(false)),
        ).subscribe({
        next: (res) => {
          if(res[0].eventType === 1) {
            const event = Array.isArray(res) ? res.find((e: any) => e.eventType === 1) : null;
            if (event && event.eventData) {
              // Store work area category
              this.createAccountService.setWorkAreaCategory(payload.workAreaCategory);

              // Handle otp sender for email
              if (payload.userNameType.toLowerCase() === 'email') {
                const emailObj = event.eventData.find((d: { key: string; value: string; }) => d.key === 'Email');
                const guidObj = event.eventData.find((d: { key: string; value: string; }) => d.key.includes('Guid'));
                if (emailObj && guidObj) {
                  this.createAccountService.setCreatedAccountInfo(emailObj.value, guidObj.value);
                }
              } else if (payload.userNameType.toLowerCase() === 'mobile') {
                // Handle otp sender for mobile
                const tempIdObj = event.eventData.find((d: { key: string; value: string; }) => d.key === 'TempId');
                const phoneObj = event.eventData.find((d: { key: string; value: string; }) => d.key === 'Phone');
                if (tempIdObj && phoneObj) {
                  this.createAccountService.setMobileAccountInfo(tempIdObj.value, phoneObj.value);
                }
              }
            }
            // Navigate to OTP verification page
            // this.router.navigate(isDevMode() ? ['otp-verification'] : ['create-account/otp-verification']);
            this.router.navigate(['create-account/otp-verification']);
          } else {
            // console.log('test Himel -> ', res);
            const errorMsg = res[0].eventData.find((data: { key: string; value: string; }) => data.key === 'message')?.value
            this.toastr.error(errorMsg);
          }
        },
        error: (res) => {
          // Handle error
          alert('Account creation failed!');
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

  generatePayload(): CreateAccountRequest {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${now.getMilliseconds().toString().padStart(3, '0')}Z`;
    const userIdTypeValue = this.userIdType().value === 'email' ? 'Email' : this.userIdType().value === 'mobile' ? 'Mobile' : '';

    const nameArray = this.name().value.split(' ');
    const lastName = nameArray.length > 1 ? nameArray.pop() : '';

    const payload: CreateAccountRequest = {
      firstName: nameArray.join(' '),
      lastName: lastName ?? '',
      gender: this.gender().value ?? '',
      email: this.email().value ?? '',
      userName: (!this.isBlueCollar && !this.isDisability && this.userIdType().value === 'email')
        ? this.email().value
        : this.mobile().value,
      password: this.password().value ?? '',
      confirmPassword: this.retypePassword().value ?? '',
      status: 0,
      mobile: this.mobile().value ?? '',
      workAreaCategory: +this.skill().value || 0,
      createdFrom: 0,
      createdAt: formattedDate,
      decodeId: '',
      catTypeId: 1,
      userNameType: (this.isBlueCollar || this.isDisability)
        ? 'mobile'
        : userIdTypeValue.toLowerCase(),
      disabilityId: this.isDisability ? (this.disabilityId().value ?? '') : '',
      deviceTypeId: 0,
      countryCode: (this.countryCode().value || '').replace('+', ''),
      socialMediaId: 0,
      socialMediaName: '',
      socialMediaTimestamp: formattedDate,
      ttcId: '',
      gradeId: '',
      knownBy: '',
      isTtc: false,
      trainingCenterName: '',
      trainingDistrict: '',
      queryString: '',
      campaignId: 0,
      campaignSource: '',
      campaignReferer: '',
      isFromSocialMedia: false,
      isActive: 0,
      useType: '',
      uNtype: 0
    }

    return payload;
  }

  isCaptchaCorrect(): boolean {
    const value = this.captcha().value;
    if (value === null || value === undefined || value === '') {
      return false;
    }
    return Number(value) === this.captchaNum1 + this.captchaNum2;
  }

  loadSkillCategories() {
    let callerTypeId = 1;
    let languageType = 'EN'; //this.activeLanguage() === 'en' ? 'EN' : 'BN';
    if (this.isBlueCollar) {
      callerTypeId = 2;
      languageType = 'BN';
    } else if (this.isDisability) {
      callerTypeId = 3;
      languageType = 'BN';
    }
    this.skillCategoryService.getSkillCategories({ callerTypeId, languageType })
      .subscribe((response: SkillCategoryListResponse) => {
        if (response.isSuccess) {
          this.skillCategories.set(response.skillCategories);
          this.message = response.message ?? "";
          this.selectWorkingSkills.update(()=> this.skillCategories().map(category => ({
            value: category.categoryId,
            label: (this.isBlueCollar || this.isDisability) ? category.catNameBangla : category.catName
          })));
        } else {
          this.message = 'Error retrieving data.';
        }
      });
  }

  setupUserIdTypeListener() {
    this.userIdType().valueChanges.subscribe(value => {
      if (value === 'email') {
        const email = this.email().value;
        if (!email) {
          this.emailRadioError.set('Please select email first');
          // Unselect radio
          this.formGroup.get('userIdType')?.setValue('', { emitEvent: false });
          return;
        } else {
          this.emailRadioError.set('');
        }
        this.checkDuplicateUser({
          Email: email,
          FullName: this.name().value || undefined,
          UserName: email
        }, 'email');
      } else if (value === 'mobile') {
        const phone = this.mobile().value;
        if (!phone) {
          this.mobileRadioError.set('Please select mobile first');
          // Unselect radio
          this.formGroup.get('userIdType')?.setValue('', { emitEvent: false });
          return;
        } else {
          this.mobileRadioError.set('');
        }
        this.checkDuplicateUser({
          Phone: phone,
          FullName: this.name().value || undefined,
          UserName: phone
        }, 'mobile');
      } else {
        this.emailRadioError.set('');
        this.mobileRadioError.set('');
      }
    });
  }

  checkDuplicateUser(params: {
    Email?: string;
    Phone?: string;
    FullName?: string;
    UserName?: string;
    SocialMediaId?: string;
  }, userIdType: 'email' | 'mobile') {
    this.createAccountService.checkDuplicateUser(params).subscribe({
      next: (response: CheckDuplicateUserEventResponse) => {
        const event = response.event;
        const messageObj = event.eventData.find(d => d.key === 'message');
        const message = messageObj ? messageObj.value : '';
        if (event.eventType === 1) {
          // Success: set username field
          if (userIdType === 'email') {
            this.formGroup.get('userIdType')?.setValue('email', { emitEvent: false });
            this.formGroup.get('email')?.setValue(params.Email || '', { emitEvent: false });
            this.formGroup.get('userIdType')?.markAsTouched();
          } else if (userIdType === 'mobile') {
            this.formGroup.get('userIdType')?.setValue('mobile', { emitEvent: false });
            this.formGroup.get('mobile')?.setValue(params.Phone || '', { emitEvent: false });
            this.formGroup.get('userIdType')?.markAsTouched();
          }
          // No popup
          this.showDuplicatePopup.set(false);
        } else if (event.eventType === 2) {
          // Fail: clear username field and show popup, unselect radio
          // if (userIdType === 'email') {
          //   this.formGroup.get('email')?.setValue('', { emitEvent: false });
          // } else if (userIdType === 'mobile') {
          //   this.formGroup.get('mobile')?.setValue('', { emitEvent: false });
          // }
          this.formGroup.get('userIdType')?.setValue('', { emitEvent: false });
          this.duplicatePopupMessage.set(message || 'This User ID is not available, try another one.');
          this.showDuplicatePopup.set(true);
        }
      },
      error: () => {
        this.duplicatePopupMessage.set('Error checking for duplicates');
        this.showDuplicatePopup.set(true);
      }
    });
  }

  closeDuplicatePopup() {
    this.showDuplicatePopup.set(false);
  }

  onClickImport(type: 'fb' | 'google') {
    if(type === 'fb'){}
  }
}

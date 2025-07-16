import { Component, computed, inject, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideTranslocoScope, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ExperienceService } from '../service/experience.service';
import { SelectWorkingSkills, SkillCategory, SkillCategoryListResponse, SpecificSkillCategoryCommand } from '../interfaces/forms.interface';
import { CreateAccountService } from '../../create-account/services/create-account.service';
import { Router } from '@angular/router';
import { CookieService } from '../../../../core/services/cookie/cookie.service';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { RadioComponent } from '../../../../shared/components/radio/radio.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { DatepickerComponent } from '../../../../shared/components/datepicker/datepicker.component';
import { CheckboxComponent } from '../../../../shared/components/checkbox/checkbox.component';


@Component({
  selector: 'app-experience',
  imports: [SelectComponent, RadioComponent, InputComponent, DatepickerComponent, CheckboxComponent, FormsModule, ReactiveFormsModule, CommonModule, TranslocoDirective],
  providers: [provideTranslocoScope('experience')],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {

  isBlueCollar: boolean = false // 1 /true 2 disi-true- 3 false-1
  fb = inject(FormBuilder);
  currentDate = new Date();
  errorMsgCmp: string = '';
  expMinDate = new Date(1990, 0, 1)
  userDBDate = new Date(2000 + 12, 0, 1)
  fromDateErrmsg = "";
  toDateErrmsg = "";
  learningModeErrmsg = "";
  ntvqfLevelTriggger: boolean = true;
  skillNames: string[] = [];
  hasExpYes: string = 'Yes';
  hasExpNo: string = 'No';
  currentLanguage = 'en';
  private experienceservice = inject(ExperienceService);
  skillCategories: SkillCategory[] = [];
  message: string = '';
  selectWorkingSkills: SelectWorkingSkills[] = [];
  selectSpecificSkills: SelectWorkingSkills[] = [];
  accCatId: number = 0;

  guid: string = '';

  isDisability: boolean = false;

  getCallerType(): number {
    if (this.isBlueCollar) {
      return 2;
    } else if (this.isDisability) {
      return 3;
    } else {
      return 1;
    }
  }
  get callerTypeId(): number {
    return this.getCallerType();
  }
  private router = inject(Router);
  private cookieService = inject(CookieService)
  constructor(private translocoService: TranslocoService, private skillCategoryService: ExperienceService, private createAccountService: CreateAccountService)
  {
    this.translocoService.langChanges$.subscribe((lang) => {
      this.currentLanguage = lang;
      this.lnChangeForHaveexpRadioItem();
    });
  }


  haveExperienceRadioItem: any[] = [];

  selectNTVQFLevels: any[] = [
    { label: 'Pre-Voc Level 1', value: '1' },
    { label: 'NTVQF Level 2', value: '2' },
    { label: 'NTVQF Level 3', value: '3' },
    { label: 'NTVQF Level 4', value: '4' },
    { label: 'NTVQF Level 5', value: '5' },
    { label: 'NTVQF Level 6', value: '6' }
  ];


  expForm = this.fb.group({
    categorySelect: new FormControl<string | null>(null),
    expYears: new FormControl<number | null>(null),
    hasExp: new FormControl<boolean | null>(true),
    cmpName: new FormControl('', []),
    designation: new FormControl('', []),
    empStart: new FormControl<string | null>(null),
    empTo: new FormControl<string | null>(null),
    chkContinue: new FormControl<boolean>(false),
    skillFormArray: this.fb.array([])
  });

  categorySelectControl = computed(
    () => this.expForm.get('categorySelect') as FormControl
  );

  getSkillSelectControl(index: number) {
    return (this.getSkillFormArray.controls.at(index) as any).get('selectValue') as FormControl;
  }

  ntvqfControl(index: number) {
    return (this.getSkillFormArray.controls.at(index) as any).get('ntvqf') as FormControl;
  };

  selfSkillControl(index: number) {
    return (this.getSkillFormArray.controls.at(index) as any).get('selfSkill') as FormControl;
  };

  jobSkillControl(index: number) {
    return (this.getSkillFormArray.controls.at(index) as any).get('jobSkill') as FormControl;
  };

  eduSkillControl(index: number) {
    return (this.getSkillFormArray.controls.at(index) as any).get('eduSkill') as FormControl;
  };

  trainingSkillControl(index: number) {
    return (this.getSkillFormArray.controls.at(index) as any).get('trainingSkill') as FormControl;
  };

  ntvqfSkillControl(index: number) {
    return (this.getSkillFormArray.controls.at(index) as any).get('ntvqfSkill') as FormControl;
  };

  expYearsControl = computed(
    () => this.expForm.get('expYears') as FormControl
  );

  hasExperienceControl = computed(
    () => this.expForm.get('hasExp') as FormControl
  );

  cmpNameControl = computed(
    () => this.expForm.get('cmpName') as FormControl
  );

  designationControl = computed(
    () => this.expForm.get('designation') as FormControl
  );

  empStartControl = computed(
    () => this.expForm.get('empStart') as FormControl
  );
  empToControl = computed(
    () => this.expForm.get('empTo') as FormControl
  );

  chkContinueControl = computed(
    () => this.expForm.get('chkContinue') as FormControl
  );

  ngOnInit(): void {

    this.guid = decodeURIComponent(this.cookieService.getCookie('MybdjobsGId') as string);
    console.log('Cookie from GUID:',this.guid)

    this.getWorkAreaCategory();

    this.setDefaultLanguage();
    this.getSkillFormArray.push(this.getWorkSkillForm());
    this.skillNames.push('');

    if (this.hasExperienceControl().value) {
      this.cmpNameControl().setValidators([Validators.required]);
      this.designationControl().setValidators([Validators.required]);
    }

    this.skillCategoryService.getSkillCategories({
      callerTypeId: this.callerTypeId,
      languageType: this.currentLanguage.toUpperCase()
    })
      .subscribe((response: SkillCategoryListResponse) => {
        if (response.isSuccess) {
          this.skillCategories = response.skillCategories;
          this.message = response.message ?? "";
          this.selectWorkingSkills = this.skillCategories.map(category => ({
            value: category.categoryId,
            label: category.catName
          }));

          // Set the pre-selected category if accCatId exists
          if (this.accCatId) {
            const selectedCategory = this.skillCategories.find(cat => cat.categoryId === this.accCatId);
            if (selectedCategory) {
              this.categorySelectControl().setValue(selectedCategory.categoryId);
              // Trigger the category change to load specific skills
              this.getSpecificCategoryDetails(selectedCategory.categoryId);
            }
          }
        } else {
          this.message = 'Error retrieving data.';
        }
      });

    this.categorySelectControl().valueChanges.subscribe((value) => {
      if (value !== null) {
        this.getSpecificCategoryDetails(value)
      }
    });
  }

  getWorkAreaCategory(): void {
    this.accCatId = this.createAccountService.getWorkAreaCategory() || 0;
    console.log('category id', this.accCatId)
  }

  private setDefaultLanguage() {
    if (this.isBlueCollar || this.isDisability) {
      this.currentLanguage = 'bn';
      this.translocoService.setActiveLang('bn');
    }
  }

  getSpecificCategoryDetails(categoryId: number): void {
    this.skillCategoryService.getSkillCategories({
      callerTypeId: this.callerTypeId,
      languageType: 'EN',
      specificCategorySkill: categoryId.toString()
    }).subscribe((response: SkillCategoryListResponse) => {
      if (response.isSuccess && response.skillCategories.length > 0) {
        const updatedCategory = response.skillCategories[0];
        this.skillCategories = this.skillCategories.map(cat =>
          cat.categoryId === updatedCategory.categoryId ? updatedCategory : cat
        );

        if (updatedCategory.specificSkillCategories && updatedCategory.specificSkillCategories.length) {
          this.selectSpecificSkills = updatedCategory.specificSkillCategories.map(skill => ({
            value: skill.skillID,
            label: skill.skillName
          }));
        } else {
          this.selectSpecificSkills = [];
        }
      }
    });
  }
  private lnChangeForHaveexpRadioItem() {
    if (this.currentLanguage === 'en') {
      this.haveExperienceRadioItem = [
        { id: true, name: 'hasExperience', label: "Yes" },
        { id: false, name: 'hasExperience', label: "No" },
      ];
    }
    else {
      this.haveExperienceRadioItem = [
        { id: true, name: 'hasExperience', label: "হ্যাঁ" },
        { id: false, name: 'hasExperience', label: "না" },
      ];
    }
  }

  addWorkSkill() {
    if (this.getSkillFormArray.length > 10) {
      let msg = "";
      if (this.currentLanguage === 'en') {
        msg = "You can add maximum 10 working skills.";
      }
      else {
        msg = "কাজের ধরন ১০টির বেশি নির্বাচন করা যাবে না।";
      }
      alert(msg);
      return;
    }
    const form = this.getWorkSkillForm();
    this.getSkillFormArray.push(form);
    this.skillNames.push('');
  }

  get getSkillFormArray(): FormArray {
    return this.expForm.controls.skillFormArray;
  }
  howDidYouLearnddChange(index: number) {
    const selected = this.getSkillSelectControl(index).value;
    const d = this.selectSpecificSkills.find(x => x.value == selected);
    if (d) {
      this.skillNames[index] = d.label;
    }
  }
  validateCmpName() {

    let validateCmp: any[] = [true, ''];
    let isCmpNameValid = true;
    let errorCmpMsg = '';
    if (this.hasExperienceControl().value) {

      this.cmpNameControl()
      if (this.cmpNameControl().touched) {
        if (this.cmpNameControl().value == '') {
          isCmpNameValid = false
          if (this.currentLanguage === 'en') {
            errorCmpMsg = "Please enter Company Name."
          }
          else {
            errorCmpMsg = "কোম্পানির নাম লিখুন।"
          }

        }

        if (this.cmpNameControl().value.length > 100) {
          isCmpNameValid = false
          if (this.currentLanguage === 'en') {
            errorCmpMsg = "Company Name Maximum 100 characters limit."
          }
          else {
            errorCmpMsg = "কোম্পানির নাম ১০০ অক্ষরের বেশি হবে না।"
          }
        }

        if (this.checkString(this.cmpNameControl().value)) {
          isCmpNameValid = false
          if (this.currentLanguage === 'en') {
            errorCmpMsg = "Please enter valid input."
          }
          else {
            errorCmpMsg = "দয়া করে বৈধ ইনপুট লিখুন।"
          }
        }
        validateCmp.unshift(isCmpNameValid, errorCmpMsg);
      }
    }
    return validateCmp;
  }
  validateDesignation() {
    let validateDes: any[] = [true, ''];
    let isDesignationValid = true;
    let errorDesMsg = '';
    if (this.hasExperienceControl().value) {
      if (this.designationControl().touched) {
        if (this.designationControl().value == '') {
          isDesignationValid = false
          if (this.currentLanguage === 'en') {
            errorDesMsg = "Please enter Designation."
          }
          else {
            errorDesMsg = "পদবী লিখুন।"
          }

        }

        if (this.designationControl().value.length > 100) {
          isDesignationValid = false
          if (this.currentLanguage === 'en') {
            errorDesMsg = "Designation Maximum 100 characters."
          }
          else {
            errorDesMsg = "পদবী ১০০ অক্ষরের বেশি হবে না।"
          }
        }

        if (this.checkString(this.designationControl().value)) {
          isDesignationValid = false
          if (this.currentLanguage === 'en') {
            errorDesMsg = "Please enter valid input."
          }
          else {
            errorDesMsg = "দয়া করে কার্যকর ইনপুট দিন।"
          }
        }
        validateDes.unshift(isDesignationValid, errorDesMsg);
      }
    }
    return validateDes;
  }

  validateExpFromDate() {
    let errorFromDateMsg = '';
    if (this.hasExperienceControl().value) {

      if (this.empStartControl().value == '' || this.empStartControl().value == null) {
        if (this.currentLanguage === 'en') {
          errorFromDateMsg = "Please enter From Date."
        }
        else {
          errorFromDateMsg = "চাকরী শুরুর তারিখ লিখুন।"
        }
      }
      else if (this.empStartControl().value > this.currentDate) {
        if (this.currentLanguage === 'en') {
          errorFromDateMsg = "From Date can not be greater than current date!"
        }
        else {
          errorFromDateMsg = "তারিখ বর্তমান তারিখের চেয়ে বড় হবে না!"
        }
      }
    }
    return errorFromDateMsg;
  }
  validateExpToDate() {
    let errorToDateMsg = '';
    if (this.hasExperienceControl().value) {
      if (this.chkContinueControl().value == false) {
        if (this.empToControl().value == '' || this.empToControl().value == null) {
          if (this.currentLanguage === 'en') {
            errorToDateMsg = "চাকরীর শেষ তারিখ লিখুন।"
          }
          else {
            errorToDateMsg = "Please enter To Date."
          }
        }
        else if (this.empToControl().value > this.currentDate) {
          if (this.currentLanguage === 'en') {
            errorToDateMsg = "To Date can not be greater than current date!"
          }
          else {
            errorToDateMsg = " তারিখ বর্তমান তারিখের চেয়ে বড় হবে না!"
          }
        }
      }
    }
    return errorToDateMsg;
  }

  validateExpDateWithDB() {
    let errorExpDateMsg = '';
    if (this.hasExperienceControl().value) {

      if ((this.userDBDate > this.empStartControl().value) && this.empStartControl().value != "" && this.empStartControl().value != null) {
        if (this.currentLanguage === 'en') {
          errorExpDateMsg = "From Date will be at least 12 years after your date of birth."
        }
        else {
          errorExpDateMsg = "তারিখ থেকে আপনার জন্ম তারিখের কমপক্ষে ১২ বছর পর হবে।"
        }

      }
      else if ((this.empToControl().value != "" && this.empToControl().value != null) && (this.empStartControl().value != "" && this.empStartControl().value != null)) {
        let _SFROM = this.empStartControl().value;
        let _STO = this.empToControl().value;

        let total_monthsFromExp = this.monthDiff(_SFROM, _STO) / 12;
        let total_MonthFromDB = this.monthDiff(this.userDBDate, this.currentDate) / 12;
        total_MonthFromDB = total_MonthFromDB - 12;

        if (total_monthsFromExp > total_MonthFromDB) {
          if (this.currentLanguage === 'en') {
            errorExpDateMsg = "From Date will be at least 12 years after your date of birth.";
          }
          else {
            errorExpDateMsg = "তারিখ থেকে আপনার জন্ম তারিখের কমপক্ষে ১২ বছর পর হবে।";
          }
        }
      }
    }
    return errorExpDateMsg;
  }

  monthDiff(date1: Date, date2: Date): number {
    const years = date2.getFullYear() - date1.getFullYear();
    const months = date2.getMonth() - date1.getMonth();

    return years * 12 + months;
  }

  isExistSpecialCharacter(strVal: string): boolean {
    const specialCharacters = [">", "<", "$", "<script>", "~", "--", "/*", "||", ";"];
    return specialCharacters.some(char => strVal.includes(char));
  }

  checkString(input: string) {
    if (this.isExistSpecialCharacter(input)) {
      return true;
    } else {
      return false;
    }
  }

  getWorkSkillForm() {
    return this.fb.group({
      selectValue: new FormControl('', []),
      ntvqf: new FormControl<string>(''),
      selfSkill: new FormControl<boolean>(false),
      jobSkill: new FormControl<boolean>(false),
      eduSkill: new FormControl<boolean>(false),
      trainingSkill: new FormControl<boolean>(false),
      ntvqfSkill: new FormControl<boolean>(false),
    });
  }

  deleteSkill(index: number) {
    this.expForm.controls.skillFormArray.removeAt(index);
    this.skillNames.splice(index, 1);
  }

  validateLearningMode() {
    for (let i = 0; i < this.getSkillFormArray.length; i++) {
      const fromGroup = this.getSkillFormArray.at(i);
      var selfSkillFromGroup = fromGroup.value.selfSkill;
      var jobSkillFromGroup = fromGroup.value.jobSkill;
      var eduSkillFromGroup = fromGroup.value.eduSkill;
      var ntvqfSkillFromGroup = fromGroup.value.ntvqfSkill;
      var trainingSkillFromGroup = fromGroup.value.trainingSkill;
      var ntvqflevel = fromGroup.value.ntvqf;

      if (selfSkillFromGroup) {
        return true;
      }
      else if (jobSkillFromGroup) {
        return true;
      }
      else if (eduSkillFromGroup) {
        return true;
      }
      else if (trainingSkillFromGroup) {
        return true;
      }
      else if (ntvqfSkillFromGroup) {
        if (ntvqflevel == "") {
          this.ntvqfLevelTriggger = false;
          return false;
        }
        else {
          return true;
        }
      }
    }
    return false;
  }

  validateExpForm() {
    this.fromDateErrmsg = "";
    this.toDateErrmsg = "";
    this.learningModeErrmsg = "";

    if (this.validateExpFromDate() != "") {
      this.fromDateErrmsg = this.validateExpFromDate();
      return false;
    }
    else {
      if (this.fromDateErrmsg == "") {
        if (this.validateExpDateWithDB() != "") {
          this.fromDateErrmsg = this.validateExpDateWithDB();
          return false;
        }
      }
    }

    if (this.validateExpToDate() != "") {
      this.toDateErrmsg = this.validateExpToDate();
      return false;
    }

    if (!this.validateLearningMode()) {
      if (!this.ntvqfLevelTriggger) {
        if (this.currentLanguage === 'en') {
          this.learningModeErrmsg = "Please select ntvqf level."
        }
        else {
          this.learningModeErrmsg = "NTVQF লেভেল নির্বাচন করুন।"
        }

      }
      else {
        if (this.currentLanguage === 'en') {
          this.learningModeErrmsg = "Select the mode of learning the work style."
        }
        else {
          this.learningModeErrmsg = "কিভাবে দক্ষতা অর্জন করেছেন তা নির্বাচন করুন।"
        }
      }
      return false;
    }
    return true;
  }

  onSubmit() {
    this.expForm.markAllAsTouched();

    if (!this.validateExpForm() || this.expForm.invalid) {
      return;
    }

    const skills = this.getSkillFormArray.controls.map((control, index) => {
      const val = control.value;
      const selectedSkillId = val.selectValue;
      const selectedSkillName = this.selectSpecificSkills.find(s => s.value === +selectedSkillId)?.label ?? '';

      return {
        skillId: String(selectedSkillId),
        skillName: String(selectedSkillName),
        ntvqfLevel: val.ntvqf ? parseInt(val.ntvqf, 10) : undefined,
        skillGuid: null,
        skilledBy: [{
          selfId: val.selfSkill ? 1 : undefined,
          jobId: val.jobSkill ? 2 : undefined,
          educationalId: val.eduSkill ? 3 : undefined,
          professional_TrainingId: val.trainingSkill ? 4 : undefined
        }]
      };
    });



    const totalExp = this.isBlueCollar
      ? (this.expYearsControl().value ?? 0)
      : -1;

      const payload: SpecificSkillCategoryCommand = {
      userGuidId: this.guid,
      categoryId: Number(this.categorySelectControl().value),
      hasExperience: this.hasExperienceControl().value ?? false,
      skills,
      p_UserGuid: null,
      tottalExperience: totalExp,
      isFromFair: false
    };

    if (!this.isBlueCollar) {
      payload.experienceRequestDataEntitys = {
        companyName: this.cmpNameControl().value!,
        designation: this.designationControl().value!,
        startingDate: this.empStartControl().value!,
        endingDate: this.empToControl().value!,
        stillContinuing: this.chkContinueControl().value
      };
      this.experienceservice.createExperience(payload).subscribe((result: any) => {
        if (Array.isArray(result) && result.length > 0 && result[0].eventType === 1) {
          console.log("success");
          this.router.navigate(['create-account/education-info']);
        } else {
          console.log("error in inserting experience");
        }
      });

    }

  }
}

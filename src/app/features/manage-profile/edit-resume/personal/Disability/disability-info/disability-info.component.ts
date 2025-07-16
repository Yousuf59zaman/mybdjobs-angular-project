import {
  Component,
  computed,
  inject,
  input,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import {
  DisabilityInfoPayload,
  DisabilityRecord,
} from '../models/disability-info-model';
import { DisabilityInfoService } from '../services/disability-info.service';

import { AccordionManagerService } from '../../../../../../shared/services/accordion.service';
import { SelectboxComponent } from '../../../../../../shared/components/selectbox/selectbox.component';
import { InputComponent } from '../../../../../../shared/components/input/input.component';
import { CookieService } from '../../../../../../core/services/cookie/cookie.service';
import { selectBoxItem } from '../../../../../../shared/models/models';
import { finalize } from 'rxjs';
import { AccordionMainBodyComponent } from "../../../../../../shared/components/accordion-main-body/accordion-main-body.component";
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-disability-info',
  imports: [NgClass, SelectboxComponent, InputComponent, ReactiveFormsModule, AccordionMainBodyComponent,TranslocoModule],
  templateUrl: './disability-info.component.html',
  styleUrl: './disability-info.component.scss',
  providers: [provideTranslocoScope('disability')],
})
export class DisabilityInfoComponent implements OnChanges {
  isDisabilityInfoOpen = input(false);
  isDisabilityFormOpen = signal(false);
  private id = 'disability-info';
  private accordionService = inject(AccordionManagerService);
  private cookieService = inject(CookieService);
  private svc = inject(DisabilityInfoService);

  records: DisabilityRecord[] = [];
  userGuid: string | null = null;
  isLoading = signal(true);
  get hasDisability(): boolean {
    return this.records.length > 0 && !!this.records[0]?.disabilityID?.trim();
  }

  ngOnInit() {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId');  //uncomment this line before testing/live
    this.userGuid = rawGuid ? decodeURIComponent(rawGuid) : null;

  }

  private loadData(): void {
    this.svc.getByUserGuid(this.userGuid?? '').pipe(
      finalize(()=> this.isLoading.update(()=> false))
    ).subscribe({
      next: (resp) => {
        this.records = resp.event.eventData?.[0]?.value ?? [];
        const hasDisability = this.hasDisability;
        if (this.hasDisability) {
          this.form.patchValue({
            hasDisability: hasDisability,
            nationalId: this.records[0].disabilityID,
            showOnResume: this.records[0].iscvDisAbilityShow,
            difficultyToSee: this.records.find((r) => r.dtID === 1)
              ?.disability_Level,
            difficultyToHear: this.records.find((r) => r.dtID === 2)
              ?.disability_Level,
            difficultyMobility: this.records.find((r) => r.dtID === 3)
              ?.disability_Level,
            difficultyToConcentrateOrRemember: this.records.find(
              (r) => r.dtID === 4
            )?.disability_Level,
            difficultySelfCare: this.records.find((r) => r.dtID === 5)
              ?.disability_Level,
            difficultyCommunication: this.records.find((r) => r.dtID === 6)
              ?.disability_Level,
          });
          this.bindForm(this.records);
          this.isNationalDisabilityIdNumberAvailable.set(
            hasDisability ? 'yes' : 'no'
          );

          // Update national ID validation based on initial state
          this.isNationalDisabilityIdNumberAvailableChange(
            hasDisability ? 'yes' : 'no'
          );
        }
      },
      error: (err) => console.error('Couldn’t load disability info', err),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isDisabilityInfoOpen() && !this.isOpen()) {
      const willOpen = !this.accordionService.isOpen(this.id)();
      this.toggle();
      if(willOpen)
      {
        this.loadData();
      }
    }
  }
  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }
  toggle() {
    this.accordionService.toggle(this.id);
  }
  closeOtherForm() {
    this.isDisabilityFormOpen.set(false);
  }
  form = new FormGroup({
    nationalId: new FormControl('', [
      Validators.pattern(/^[0-9]*$/),
      Validators.minLength(10),
      Validators.maxLength(20),
    ]),
    difficultyToSee: new FormControl('-1'),
    difficultyToHear: new FormControl('-1'),
    difficultyToConcentrateOrRemember: new FormControl('-1'),
    difficultyMobility: new FormControl('-1'),
    difficultyCommunication: new FormControl('-1'),
    difficultySelfCare: new FormControl('-1'),
    showOnResume: new FormControl(),
    hasDisability: new FormControl(),
  });

  nationalIdControl = computed(
    () => this.form.get('nationalId') as FormControl<string | null>
  );

  difficultyToSeeControl = computed(
    () => this.form.get('difficultyToSee') as FormControl<string | null>
  );

  difficultyToHearControl = computed(
    () => this.form.get('difficultyToHear') as FormControl<string | null>
  );

  difficultyToConcentrateControl = computed(
    () =>
      this.form.get('difficultyToConcentrateOrRemember') as FormControl<
        string | null
      >
  );

  // Control getters
  difficultyMobilityControl = computed(
    () => this.form.get('difficultyMobility') as FormControl<string | null>
  );

  difficultySelfCareControl = computed(
    () => this.form.get('difficultySelfCare') as FormControl<string | null>
  );
  showOnResumeControl = computed(
    () => this.form.get('showOnResume') as FormControl<string | null>
  );
  difficultyCommunicationControl = computed(
    () => this.form.get('difficultyCommunication') as FormControl<string | null>
  );
  closeForm(): void {
    this.isDisabilityFormOpen.set(false);
    this.form.reset(this.form.value);
  }

  isShownOnResume = true;
  setResumeVisibilityBtn(value: boolean): void {
    this.isShownOnResume = value;
    console.log('show on resume value ', value);

    this.form.patchValue({ showOnResume: value ? 1 : 0 });
  }
  isNationalDisabilityIdNumberAvailable = signal('no');

   onExpandClick() {
    const willOpen = !this.accordionService.isOpen(this.id)();
    this.toggle(); // toggles the accordion
    if (willOpen) {
      this.loadData()
    }
  }

  isNationalDisabilityIdNumberAvailableChange(value: string): void {
    const isYes = value === 'yes';
    this.isNationalDisabilityIdNumberAvailable.set(value);
    console.log('this is ', value);

    this.form.get('hasDisability')?.setValue(isYes);
    this.form.get('nationalId')?.setErrors(null);

    if (isYes) {
      this.nationalIdControl().setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{10,20}$/),
      ]);
      this.difficultyToSeeControl().clearValidators();
      this.difficultyCommunicationControl().clearValidators();
      this.difficultyMobilityControl().clearValidators();
      this.difficultyToConcentrateControl().clearValidators();
      this.difficultyToHearControl().clearValidators();
      this.difficultySelfCareControl().clearValidators();
    } else {
      this.nationalIdControl().clearValidators();
      this.nationalIdControl().reset();
      this.difficultyToSeeControl().reset();
      this.difficultyCommunicationControl().reset();
      this.difficultyMobilityControl().reset();
      this.difficultyToConcentrateControl().reset();
      this.difficultyToHearControl().reset();
      this.difficultySelfCareControl().reset();
    }
    this.nationalIdControl().updateValueAndValidity();
    this.difficultyToSeeControl().updateValueAndValidity();
    this.difficultyCommunicationControl().updateValueAndValidity();
    this.difficultyMobilityControl().updateValueAndValidity();
    this.difficultyToConcentrateControl().updateValueAndValidity();
    this.difficultyToHearControl().updateValueAndValidity();
    this.difficultySelfCareControl().updateValueAndValidity();
  }

  onSubmit(): void {
    console.log('I am clicked', this.form.value);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('form is unvalid');

      return;
    }

    const formValue = this.form.value;
    const hasDisability = this.form.value.hasDisability;
    const disabilityId = hasDisability ? formValue.nationalId : '';

    const payload: DisabilityInfoPayload = {
      userGuid: this.userGuid ?? '',
      isDisabilityInfoGiven: hasDisability ? 1 : 0,
      disAbilityId: disabilityId || '',
      isShownOnCv: formValue.showOnResume ? 1 : 0,
      isDeleteRequest: 0,

      // Disability type mappings
      seenProblemVal: this.getProblemValue(formValue.difficultyToSee ?? '-1'),
      seenProblemDtID: '1',
      seenProblemDiID: '0',

      hearProblemVal: this.getProblemValue(formValue.difficultyToHear ?? '-1'),
      hearProblemDtID: '2',
      hearProblemDiID: '0',

      sswcProblemVal: this.getProblemValue(
        formValue.difficultyMobility ?? '-1'
      ),
      sswcProblemDtID: '3',
      sswcProblemDiID: '0',

      concProblemVal: this.getProblemValue(
        formValue.difficultyToConcentrateOrRemember ?? '-1'
      ),
      concProblemDtID: '4',
      concProblemDiID: '0',

      commProblemVal: this.getProblemValue(
        formValue.difficultyCommunication ?? '-1'
      ),
      commProblemDtID: '6',
      commProblemDiID: '0',

      tcareProblemVal: this.getProblemValue(
        formValue.difficultySelfCare ?? '-1'
      ),
      tcareProblemDtID: '5',
      tcareProblemDiID: '0',
    };

    this.svc.saveData(payload).subscribe({
      next: () => {
        console.log('Data saved successfully');
        this.loadData(); // Reload the latest data
        this.isSaved.set(true);
        this.closeForm();
      },
      error: (err) => console.log('error is post api'),
    });
  }

  private getProblemValue(value: string | undefined): string {
    return value && value !== 'No Difficulty' ? value : '';
  }

  isProvidedDIdNum = signal(false);

  isSaved = signal(false);

  difficultyToSee: selectBoxItem[] = [
    {
      label: 'Select',
      value: '-1',
    },
    {
      label: 'Yes - some difficulty',
      value: 'Yes - some difficulty',
    },
    {
      label: 'Yes - a lot of difficultys',
      value: 'Yes - a lot of difficulty',
    },
    {
      label: 'Can not do at all',
      value: 'Can not do at all',
    },
  ];
  isDisability: selectBoxItem[] = [
    {
      label: 'Yes',
      value: 1,
    },
    {
      label: 'No',
      value: 0,
    },
  ];
  difficultyToHear: selectBoxItem[] = [
    {
      label: 'Select',
      value: '-1',
    },
    {
      label: 'Yes - some difficulty',
      value: 'Yes - some difficulty',
    },
    {
      label: 'Yes - a lot of difficultys',
      value: 'Yes - a lot of difficulty',
    },
    {
      label: 'Can not do at all',
      value: 'Can not do at all',
    },
  ];
  difficultyToConcentrateOrRemember: selectBoxItem[] = [
    {
      label: 'Select',
      value: '-1',
    },
    {
      label: 'Yes - some difficulty',
      value: 'Yes - some difficulty',
    },
    {
      label: 'Yes - a lot of difficultys',
      value: 'Yes - a lot of difficulty',
    },
    {
      label: 'Can not do at all',
      value: 'Can not do at all',
    },
  ];
  difficultyMobility: selectBoxItem[] = [
    {
      label: 'Select',
      value: '-1',
    },
    {
      label: 'Yes - some difficulty',
      value: 'Yes - some difficulty',
    },
    {
      label: 'Yes - a lot of difficultys',
      value: 'Yes - a lot of difficulty',
    },
    {
      label: 'Can not do at all',
      value: 'Can not do at all',
    },
  ];
  difficultyCommunication: selectBoxItem[] = [
    {
      label: 'Select',
      value: '-1',
    },
    {
      label: 'Yes - some difficulty',
      value: 'Yes - some difficulty',
    },
    {
      label: 'Yes - a lot of difficultys',
      value: 'Yes - a lot of difficulty',
    },
    {
      label: 'Can not do at all',
      value: 'Can not do at all',
    },
  ];
  difficultySelfCare: selectBoxItem[] = [
    {
      label: 'Select',
      value: '-1',
    },
    {
      label: 'Yes - some difficulty',
      value: 'Yes - some difficulty',
    },
    {
      label: 'Yes - a lot of difficultys',
      value: 'Yes - a lot of difficulty',
    },
    {
      label: 'Can not do at all',
      value: 'Can not do at all',
    },
  ];

  private bindForm(record: DisabilityRecord[]): void {
    const hasDis = !!record[0].disabilityID?.trim();
    this.form.get('hasDisability')!.setValue(hasDis);
    this.isNationalDisabilityIdNumberAvailable.set(hasDis ? 'yes' : 'no');
    this.isNationalDisabilityIdNumberAvailableChange(hasDis ? 'yes' : 'no');

    // 2) nationalId & showOnResume
    if (hasDis) {
      this.nationalIdControl().setValue(record[0].disabilityID!);
      this.isShownOnResume = !!record[0].iscvDisAbilityShow;
      this.form.get('showOnResume')!.setValue(this.isShownOnResume ? 1 : 0);
    } else {
      this.nationalIdControl().reset();
      this.form.get('showOnResume')!.reset();
    }

    this.difficultyToSeeControl().setValue(this.findDisabilityValue(1, record));
    this.difficultyToHearControl().setValue(
      this.findDisabilityValue(2, record)
    );
    this.difficultyMobilityControl().setValue(
      this.findDisabilityValue(3, record)
    );
    this.difficultyToConcentrateControl().setValue(
      this.findDisabilityValue(4, record)
    );
    this.difficultySelfCareControl().setValue(
      this.findDisabilityValue(5, record)
    );
    this.difficultyCommunicationControl().setValue(
      this.findDisabilityValue(6, record)
    );
  }
  private findDisabilityValue(
    dtID: number,
    records: DisabilityRecord[]
  ): string {
    const match = records.find((r) => r.dtID === dtID);
    console.log('this is dis level', match?.disability_Level);

    return match?.disability_Level ?? '';
  }
}

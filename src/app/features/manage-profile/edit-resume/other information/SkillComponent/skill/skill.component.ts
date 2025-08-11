import {
  Component,
  computed,
  HostListener,
  inject,
  input,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextEditorComponent } from '../../../../../../shared/components/text-editor/text-editor.component';
import { AccordionManagerService } from '../../../../../../shared/services/accordion.service';
import { AccordionMainBodyComponent } from '../../../../../../shared/components/accordion-main-body/accordion-main-body.component';
import { NoDetailsComponent } from '../../../../../../shared/components/no-details/no-details.component';
import { SkillService } from '../services/skills.service';
import {
  DeleteSkillPayload,
  SkillPayload,
  SkillResponseItem,
  UISkill,
  UpdateSkillPayload,
} from '../models/skillModel';
import { finalize } from 'rxjs';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CookieService } from '../../../../../../core/services/cookie/cookie.service';

@Component({
  selector: 'app-skill',
  standalone: true,
  imports: [
    TextEditorComponent,
    FormsModule,
    AccordionMainBodyComponent,
    NoDetailsComponent,
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
  ],
  templateUrl: './skill.component.html',
  styleUrl: './skill.component.scss',
  providers: [provideTranslocoScope('skills')],
})
export class SkillComponent {
  private accordionService = inject(AccordionManagerService);
  private skillService = inject(SkillService);
  private transLocoService = inject(TranslocoService)
  private cookieService = inject(CookieService);
  isDeleteModalOpen = signal(false);
  isSkillOpen = input(false);
  isFormOpen = signal(false);
  isEditing = signal(false);
  currentEditingIndex: number | null = null;
  skillDescription = signal('');
  isDescFormOpen = signal(false);
  isMaxExceed = signal(true);
  descriptionControl = new FormControl('');
  skillToDelete: number | null = null;
  isSaving = false;
  isLoading = signal(true);
  private id = 'skillinfo';
  userGuid: string =
'';

  ntqfLevels = [
    { value: '-1', label: 'Select' },
    { value: '1', label: 'Pre-Voc Level 1' },
    { value: '2', label: 'Pre-Voc Level 2' },
    { value: '3', label: 'NTVQF Level 1' },
    { value: '4', label: 'NTVQF Level 2' },
    { value: '5', label: 'NTVQF Level 3' },
    { value: '6', label: 'NTVQF Level 4' },
    { value: '7', label: 'NTVQF Level 5' },
    { value: '8', label: 'NTVQF Level 6' },
  ];

  skills: UISkill[] = [];

  skillDetails = signal([
    { label: 'Others', value: '-1' },
    { label: 'Self', value: '1' },
    { label: 'Job', value: '2' },
    { label: 'Educational', value: '3' },
    { label: 'Professional Training', value: '4' },
    { label: 'NTVQF', value: '5' },
  ]);

  skillDetailsBng = [
  { label: 'নিজেই', value: '1' },
  { label: 'চাকরিতে', value: '2' },
  { label: 'শিক্ষা ক্ষেত্রে', value: '3' },
  { label: 'ট্রেনিং-এ', value: '4' },
  { label: 'NTVQF', value: '5' },
  ]

  ntvqfValueHold: string = '5';
   ngOnChanges(changes: SimpleChanges): void {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId'); 
    this.userGuid = rawGuid ? decodeURIComponent(rawGuid) : "";
    if (this.isSkillOpen() && !this.isOpen()) {
      const willOpen = !this.accordionService.isOpen(this.id)();
      this.toggle();
      if (willOpen) {
        this.loadSkills(this.userGuid);
      }
    }
  }
  
  
  
  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    this.accordionService.toggle(this.id);
  }
   onExpandClick() {
    const willOpen = !this.accordionService.isOpen(this.id)();
    this.toggle(); // toggles the accordion

    if (willOpen) {
      this.loadSkills(this.userGuid);
    }
  }

  currentSkillDetails = computed(() => {
  const activeLang = this.transLocoService.getActiveLang();
  return activeLang === 'bn' ? this.skillDetailsBng : this.skillDetails();
});

  skillsForm = new FormGroup(
    {
      skillName: new FormControl<string>(''),
      learnedMethods: new FormControl<string[]>([]),
      ntqfLevel: new FormControl<string>(''),
      skillId: new FormControl<string>(''),
    },
    { validators: this.skillFormValidator() }
  );

  loadSkills(userGuid: string): void {
    this.skillService
      .getSkills(userGuid)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (skills) => {
          this.skills = skills;
          this.isMaxExceed.set(this.skills.length < 20);
          const skillWithDescription = skills.find((s) => s.description);
          if (skillWithDescription?.description) {
            this.skillDescription.set(skillWithDescription.description);
          }
        },
        error: (err) => {
          console.error('Failed to load skills:', err);
          // Handle error appropriately
        },
      });
  }
  handleFormToggle() {
    if(this.isMaxExceed())
    {
      this.addNewSkill();
    }
  return this.isMaxExceed(); // Return whether max is exceeded
}

  openNewSkillForm() {
  this.isFormOpen.set(true);
  this.isEditing.set(false);
  this.skillsForm.reset(); // Reset form when opening

}

  addNewSkill() {
    this.openNewSkillForm();
  }

  editSkill(index: number) {
    this.isFormOpen.set(true);
    this.isEditing.set(true);
    this.currentEditingIndex = index;
    const skill = this.skills[index];
    // Map learned methods back to their values
    const methodValues = skill.learnedMethods.map((method) => {
      const found = this.skillDetails().find((m) => m.label === method);
      return found ? found.value : method;
    });

    this.skillsForm.patchValue({
      skillName: skill.skillName,
      learnedMethods: methodValues,
      ntqfLevel: skill.ntqfLevel || '',
      skillId: skill.skillId.toString(),
    });
  }

  readonly NTVQF_METHOD_VALUE = '5';
  updateLearnedMethods(methodValue: string, isChecked: boolean) {
    const currentMethods = this.skillsForm.get('learnedMethods')?.value || [];
    let newMethods: string[];

    if (isChecked) {
      newMethods = [...currentMethods, methodValue];
    } else {
      newMethods = currentMethods.filter((m) => m !== methodValue);
      if (methodValue === this.NTVQF_METHOD_VALUE) {
        this.skillsForm.get('ntqfLevel')?.setValue('');
      }
    }

    this.skillsForm.get('learnedMethods')?.setValue(newMethods);
  }

  formSubmitted = false;
  saveSkill() {
    this.formSubmitted = true;
    this.skillsForm.markAllAsTouched();

    if (this.skillsForm.invalid) {
      return;
    }

    if (this.isSaving) return;
    this.isSaving = true;

    const formValue = this.skillsForm.value;
    const skilledByNumbers = (formValue.learnedMethods ?? [])
      .filter(
        (method) => method !== null && method !== undefined && method !== ''
      )
      .map((method) => parseInt(method, 10));

    if (this.isEditing() && this.currentEditingIndex !== null) {
      // Update existing skill
      const skill = this.skills[this.currentEditingIndex];
      const payload: UpdateSkillPayload = {
        userGuid: this.userGuid,
        primarySkillId: skill.primarySkillId,
        skillId: parseInt(formValue.skillId ?? '0', 10),
        skilledBy: skilledByNumbers.join(','), // Convert array to comma-separated string
        ntvqfLevel: formValue.ntqfLevel || '',
      };

      this.skillService
        .updateSkill(payload)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          })
        )
        .subscribe({
          next: (response) => {
            this.loadSkills(this.userGuid);
            this.cancelEdit();
          },
          error: (err) => {
          },
        });
    } else {
      // Create new skill
      const payload: SkillPayload = {
        userGuid: this.userGuid,
        skill_Id: parseInt(formValue.skillId ?? '0', 10),
        skilled_By: skilledByNumbers,
        ntvqf: formValue.ntqfLevel || '',
      };

      this.skillService
        .addSkill(payload)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          })
        )
        .subscribe({
          next: (response) => {
            this.loadSkills(this.userGuid);
            this.cancelEdit();
          },
          error: (err) => {
          },
        });
    }
  }

  cancelEdit() {
    this.skillsForm.reset();
    this.formSubmitted = false;
    this.isFormOpen.set(false);
    this.isEditing.set(false);
    this.currentEditingIndex = null;
  }

  getNtqfLevelLabel(value: string): string {
    const level = this.ntqfLevels.find((l) => l.value === value);
    return level ? level.label : '';
  }

  openDeleteModal(index: number) {
    this.skillToDelete = index;
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal() {
    this.skillToDelete = null;
    this.isDeleteModalOpen.set(false);
  }

  confirmDelete() {
    if (this.skillToDelete === null) return;
    if (this.isSaving) return;
    const skillToDelete = this.skills[this.skillToDelete];
    if (!skillToDelete) {
      this.closeDeleteModal();
      return;
    }

    this.isSaving = true;

    const payload: DeleteSkillPayload = {
      userGuid: this.userGuid,
      skillId: skillToDelete.skillId, // or whatever property holds the ID
    };

    this.skillService
      .deleteSkill(payload)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.closeDeleteModal();
        })
      )
      .subscribe({
        next: () => {
          // Refresh the skills list after successful deletion
          this.isSaving = false;
          this.loadSkills(this.userGuid);
          // Optional: Show success message
        },
        error: (err) => {
          console.error('Failed to delete skill:', err);
          // Optional: Show error message
        },
      });
  }

  // Description methods
  openDescForm() {
    this.descriptionControl.setValue(this.skillDescription());
    this.isDescFormOpen.set(true);
  }

  saveDescription() {
    const description = this.descriptionControl.value?.toString() || '';
    this.skillDescription.set(description);
    this.isDescFormOpen.set(false);
  }

  cancelDescription() {
    this.isDescFormOpen.set(false);
  }

  deleteDescription() {
    this.skillDescription.set('');
  }
  charLimitExceeded: boolean = false;
  onClickDescSave() {
    if (this.isSaving) return;
    this.isSaving = true;
    // Get plain text content from the editor
    let divElem = document.createElement('div');
    divElem.innerHTML = this.descriptionControl.value as string;
    const newDescription = divElem.innerText;
    
    if (newDescription.length > 500) {
      this.charLimitExceeded = true;
      this.isSaving = false;
      return;
    }
    
    const payload = {
      userGuid: this.userGuid,
      skill_Description: this.descriptionControl.value || '',
      extraCurricular_Activities: '',
      isSkillDes: true,
    };

    this.skillService.updateDescription(payload).subscribe({
      next: (response) => {
        if (response[0]?.eventType === 1) {
          // Only update the description if API returned success
          this.skillDescription.set(newDescription);
          this.loadSkills(this.userGuid);
        } else {
          console.error('Update failed', response);
        }
        this.isSaving = false;
        this.isDescFormOpen.set(false);
      },
      error: (err) => {
        console.error('API error', err);
        this.isSaving = false;
      },
    });
  }

  onClickDescCancel() {
    this.descriptionControl.setValue('');
    this.isDescFormOpen.set(false);
  }

  onClickDescEdit() {
    this.descriptionControl.setValue(this.skillDescription());
    this.isDescFormOpen.set(true);
  }

  skillSuggestions = signal<SkillResponseItem[]>([]);
  showSuggestions = signal(false);
  debounceTimer: any;

  // Add this method to handle input changes
  onSkillNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Clear previous timer
    clearTimeout(this.debounceTimer);

    // Set new timer with 300ms debounce
    this.debounceTimer = setTimeout(() => {
      if (value.length >= 2) {
        this.skillService.getSkillSuggestions(value).subscribe({
          next: (suggestions) => {
            this.skillSuggestions.set(suggestions);
            this.showSuggestions.set(true);
          },
          error: (err) => {
            console.error('Failed to fetch skill suggestions:', err);
            this.skillSuggestions.set([]);
            this.showSuggestions.set(false);
          },
        });
      } else {
        this.skillSuggestions.set([]);
        this.showSuggestions.set(false);
      }
    }, 300);
  }

  // Add this method to select a suggestion
  selectSuggestion(suggestion: SkillResponseItem) {
    this.skillsForm.patchValue({
      skillName: suggestion.skillName,
      skillId: suggestion.skillID,
    });
    this.showSuggestions.set(false);
  }

  // Add this to close suggestions when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.suggestions-container')) {
      this.showSuggestions.set(false);
    }
  }

  skillFormValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const learnedMethods = formGroup.get('learnedMethods')?.value as string[];
      const ntqfLevel = formGroup.get('ntqfLevel')?.value;
      const skillId = formGroup.get('skillId')?.value;
      const errors: ValidationErrors = {};

      // Validate skillId is required
      if (!skillId) {
        errors['skillIdRequired'] = 'Skill selection is required';
      }

      // Validate at least one learning method is selected
      if (!learnedMethods || learnedMethods.length === 0) {
        errors['learningMethodRequired'] =
          'At least one learning method is required';
      }

      // Validate NTQF level is required if NTVQF method (5) is selected
      if (learnedMethods?.includes('5') && !ntqfLevel) {
        errors['ntqfLevelRequired'] =
          'NTQF level is required when learning through NTVQF';
      }

      // Add duplicate skill validation
      if (skillId) {
        const isEditing = this.isEditing();
        const currentIndex = this.currentEditingIndex;

        const isDuplicate = this.skills.some((skill, index) => {
          // Skip current skill during edit mode
          if (isEditing && currentIndex === index) return false;
          return skill.skillId.toString() === skillId;
        });

        if (isDuplicate) {
          errors['duplicateSkill'] =
            'This skill is already added to your profile';
        }
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }
}

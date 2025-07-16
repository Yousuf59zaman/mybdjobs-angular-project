import { Component, computed, EventEmitter, inject, input, Output, signal, SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoDetailsSummaryComponent } from '../no-details-training-summary/no-details-training-summary.component';
import { CommonModule, NgClass } from '@angular/common';

import { TextEditorComponent } from '../../../../../shared/components/text-editor/text-editor.component';
import { SelectboxComponent } from '../../../../../shared/components/selectbox/selectbox.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { AccordionMainBodyComponent } from '../../../../../shared/components/accordion-main-body/accordion-main-body.component';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';

@Component({
  selector: 'app-edit-education',
  imports: [
    ReactiveFormsModule,
    TextEditorComponent,
    SelectboxComponent,
    // NoDetailsSummaryComponent,
    InputComponent,
    CommonModule,
    AccordionMainBodyComponent
],
  templateUrl: './edit-education.component.html',
  styleUrl: './edit-education.component.scss'
})
export class EditEducationComponent {

  private accordionService = inject(AccordionManagerService);

  isAcademicSummaryExpanded = false;
  id = "academicsummary"
  isAcademicSummaryOpen = input(false);
  isDeleteModalOpen = signal(false)
  isAcademicSummaryEditFormOpen = signal(false);
  isAcademicSummaryNewFormOpen = signal(false);
   //isAcademicSummaryNewFormOpen1 = signal(false);
   //isAcademicSummaryNewFormOpen2 = signal(false);
    summaryForms = signal<Map<number, FormGroup>>(new Map());
  @Output() onClose = new EventEmitter<void>();
  editingSummaries = signal<Set<number>>(new Set());

isInEditMode = signal(true); // assuming you have this or similar


  ngOnChanges(changes: SimpleChanges): void {
    if(this.isAcademicSummaryOpen() && !this.isOpen()) {
      this.toggle();
    }
  }

  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    this.accordionService.toggle(this.id);
  }

  educationLevels = signal([
    { value: 'primary', label: 'Primary Education' },
    { value: 'secondary', label: 'Secondary Education' },
    { value: 'bachelor', label: 'Bachelor' },
    { value: 'master', label: 'Master' },
    { value: 'phd', label: 'PhD' }
  ]);

  degreeTitles = signal([
    { value: 'bsc', label: 'Bachelor of Science (BSc)' },
    { value: 'msc', label: 'Master of Science (MSc)' },
    { value: 'ba', label: 'Bachelor of Arts (BA)' },
    { value: 'ma', label: 'Master of Arts (MA)' }

  ]);
  isExpanded = false;
  @Output() addExperience = new EventEmitter<void>();

  toggleDropdown() {
    this.isExpanded = !this.isExpanded;
  }

  handleAddExperience() {
    this.addExperience.emit();
  }

  toggleAcademicSummary() {
    // this.isAcademicSummaryExpanded = !this.isAcademicSummaryExpanded;
  }


  result = signal([
    {
      label: 'First Divison',
      value: 'First Divison',
    },
    {
      label: 'Second Divison',
      value: 'Second Divison',
    },
    {
      label: 'Third Division',
      value: 'Third Division',
    }
  ]);


  year = signal([
    {
      label: '2010',
      value: '2010'
    },
    {
      label: '2011',
      value: '2011'
    },
    {
      label: '2012',
      value: '2012'
    },

  ]);



  form = new FormGroup({
    major: new FormControl(''),
    educationLevel: new FormControl(''),
    degreeTitle: new FormControl(''),
    institute: new FormControl(''),
    country: new FormControl(''),
    marks: new FormControl(''),
    duration: new FormControl(''),
    result: new FormControl(''),
    religion: new FormControl(''),
    year: new FormControl(''),
    achievement: new FormControl(''),
  });

  educationLevelControl = computed(
    () => this.form.get('educationLevel') as FormControl<string>
  )
  degreeTitleControl = computed(
    () => this.form.get('degreeTitle') as FormControl<string>
  )

  majorControl= computed(
    () => this.form.get('major') as FormControl<string>
  );

  instituteControl= computed(
    () => this.form.get('institute') as FormControl<string>
  );

  countryControl= computed(
    () => this.form.get('country') as FormControl<string>
  );

  marksControl= computed(
    () => this.form.get('marks') as FormControl<string>
  );

  durationControl= computed(
    () => this.form.get('duration') as FormControl<string>
  );

  resultControl= computed(
    () => this.form.get('result') as FormControl<string>
  );

  passingYearControl = computed (
    () => this.form.get('year') as FormControl<string>
  )

  achievementControl = computed(
    () => this.form.get('achievement') as FormControl<string>
  )

  onClickSave() {}

   closeForm() {
  this.resetFormState();
  this.onClose.emit();
}
// Add these to your component
editingSummary = signal<any>(null);
academicSummaries = signal<any[]>([
  {
    id: 1,
    educationLevel: 'master',
    degreeTitle: 'msc',
    major: 'Science',
    institute: 'Buet',
    result: 'First Division/Class',
    marks: '100',
    passingYear: '2024',
    duration: '2020',
    achievement: '---'
  }

]);


  initEditForm(summary: any) {
    const form = new FormGroup({
      major: new FormControl(summary.major),
      educationLevel: new FormControl(summary.educationLevel),
      degreeTitle: new FormControl(summary.degreeTitle),
      institute: new FormControl(summary.institute),
      country: new FormControl(summary.country || ''),
      marks: new FormControl(summary.marks),
      duration: new FormControl(summary.duration),
      result: new FormControl(summary.result),
      year: new FormControl(summary.passingYear),
      achievement: new FormControl(summary.achievement)
    });

    this.summaryForms().set(summary.id, form);
    this.editingSummaries.update(set => {
  const newSet = new Set(set);
  newSet.add(summary.id);
  return newSet;
});

  }

 editSummary(summary: any) {
    this.initEditForm(summary);
    this.isAcademicSummaryNewFormOpen.set(false);
  }



// Delete method
deleteSummary(id: number) {
  this.academicSummaries.update(summaries =>
    summaries.filter(summary => summary.id !== id)
  );
}

getEducationLevelLabel(value: string): string {
  const level = this.educationLevels().find(l => l.value === value);
  return level ? level.label : value;
}

getDegreeTitleLabel(value: string): string {
  const degree = this.degreeTitles().find(d => d.value === value);
  return degree ? degree.label : value;
}


  closeDeleteModal(){
    this.isDeleteModalOpen.set(false)
    document.body.style.overflow = ''
  }
   openDeleteModal(){
    this.isDeleteModalOpen.set(true)
    document.body.style.overflow = 'hidden'
  }

 saveAcademicSummary() {
  if (this.form.valid) {
    const formValue = this.form.value;
    const newId = this.editingSummary() ?
      this.editingSummary()!.id :
      this.academicSummaries().length > 0 ?
        Math.max(...this.academicSummaries().map(s => s.id)) + 1 :
        1;

    const newSummary = {
      id: newId,
      educationLevel: formValue.educationLevel || '',
      degreeTitle: formValue.degreeTitle || '',
      major: formValue.major || '',
      institute: formValue.institute || '',
      result: formValue.result || '',
      marks: formValue.marks || '',
      passingYear: formValue.year || '',
      duration: formValue.duration || '',
      achievement: formValue.achievement || ''
    };

    if (this.editingSummary()) {
      // Update existing summary
      this.academicSummaries.update(summaries =>
        summaries.map(summary =>
          summary.id === this.editingSummary()?.id ? newSummary : summary
        )
      );
    } else {
      // Add new summary
      this.academicSummaries.update(summaries => [...summaries, newSummary]);
    }

    // Reset form and editing state
    this.resetFormState();
  }
}


resetFormState() {
  this.form.reset();
  this.editingSummary.set(null);
  this.isAcademicSummaryNewFormOpen.set(false);
  //this.isAcademicSummaryNewFormOpen1.set(false);
  //this.isAcademicSummaryNewFormOpen2.set(false);
}

 showForeignInstituteCountry = signal(false);

toggleForeignInstitute(event: Event) {
  const input = event.target as HTMLInputElement;
  this.showForeignInstituteCountry.set(input.checked);
}


// In your component class
isAnyFormOpen = computed(() =>
  this.isAcademicSummaryNewFormOpen() ||
  //this.isAcademicSummaryNewFormOpen1() ||
  //this.isAcademicSummaryNewFormOpen2() ||
  this.editingSummary() !== null
);







}

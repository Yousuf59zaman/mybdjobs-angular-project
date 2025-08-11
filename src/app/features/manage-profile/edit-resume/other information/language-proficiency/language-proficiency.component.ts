import { Component, ElementRef, inject, input, OnChanges, signal, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { SelectboxComponent } from '../../../../../shared/components/selectbox/selectbox.component';
import { AccordionMainBodyComponent } from '../../../../../shared/components/accordion-main-body/accordion-main-body.component';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';
import { LanguageQuery, LanguageResponse, deleteLanguage, insertLanguage, updateLanguage } from './model/language-proficiency';
import { LanguageProficiencyService } from './service/language-proficiency.service';
import { NoDetailsComponent } from '../../../../../shared/components/no-details/no-details.component';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CookieService } from '../../../../../core/services/cookie/cookie.service';

@Component({
  selector: 'app-language-proficiency',
  imports: [
    SelectboxComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    AccordionMainBodyComponent,
    NoDetailsComponent,TranslocoModule
  ],
  providers: [provideTranslocoScope('editResumeLanguage')],
  templateUrl: './language-proficiency.component.html',
  styleUrl: './language-proficiency.component.scss'
})
export class LanguageProficiencyComponent implements OnChanges {
  private accordionService = inject(AccordionManagerService);
  private languageService = inject(LanguageProficiencyService);
  currentLanguage = 'en';
  isDeleting = false;
  isLanguageProficiencyOpen = input(false);
  isLanguageNewFormOpen = signal(false);
  isLanguageEditFormOpen = signal(false);
  editingForms = new Map<number, FormGroup>(); // key = language id
  isDeleteModalOpen = signal(false);
  isInfoAvailable = false;
  userGuidId = ''

  private id = "languageproficiency";

  @ViewChild('container', { static: true }) containerRef!: ElementRef;


  constructor(private translocoService: TranslocoService, private cookieService: CookieService) {
      this.translocoService.langChanges$.subscribe((lang) => {
        this.currentLanguage = lang;
        this.lnChangeForProficiency();
      });
    }

  languageProficiencies: LanguageResponse[] =[];
  editingLanguage: any = null;
  nextId = 2;

  // Form setup with validation
  languageform = new FormGroup({
    languageId: new FormControl<number | null>(null),
    languageName: new FormControl('', [Validators.required]),
    readingLevel: new FormControl('', [Validators.required]),
    writingLevel: new FormControl('', [Validators.required]),
    speakingLevel: new FormControl('', [Validators.required])
  });

proficiencyLevels: any[] = [];
 private lnChangeForProficiency() {
    if (this.currentLanguage === 'en') {
      this.proficiencyLevels = [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }];
    }
    else {
      this.proficiencyLevels = [
       { label: 'ভালো', value: 'High' },
        { label: 'মোটামুটি', value: 'Medium' },
        { label: 'নিম্ম', value: 'Low' }];

    }

  }


  languages = signal([
    { label: 'English', value: 'English' },
    { label: 'Chinese', value: 'Chinese' },
    { label: 'Spanish', value: 'Spanish' },
    { label: 'French', value: 'French' },
    { label: 'German', value: 'German' },
    { label: 'Japanese', value: 'Japanese' }
  ]);

  ngOnChanges(changes: SimpleChanges): void {
    if(this.isLanguageProficiencyOpen() && !this.isOpen()) {
      const willOpen = !this.accordionService.isOpen(this.id)();
      this.toggle();
      if (willOpen) {
        this.loadLanguageInfo();
      }
    }
  }

  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    const willOpen = !this.accordionService.isOpen(this.id)();
    this.accordionService.toggle(this.id);
    if (willOpen) {
      this.loadLanguageInfo();
    }
  }

    loadLanguageInfo(): void{
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || ''; // for development only
    this.userGuidId = rawGuid ? decodeURIComponent(rawGuid) : "";

     const query: LanguageQuery = {
       UserGuid: this.userGuidId ?? ""
     };


     this.languageService.getLanguageInfo(query).subscribe({
       next: (summaries) => {
         this.languageProficiencies = summaries;
         if (summaries && summaries.length > 0) {
           const summary = summaries[0];
           this.isInfoAvailable = true;
           this.languageform.patchValue({
            languageId:summary.languageId,
            languageName:summary.languageName,
            readingLevel: summary.readingLevel,
            writingLevel: summary.writingLevel,
            speakingLevel: summary.speakingLevel

           });
         } else {
           this.isInfoAvailable = false;
         }
       },
       error: (error) => {
         this.isInfoAvailable = false;
       },
       complete: () => {
       }
     });
   }

    createFormGroup(language?: LanguageResponse): FormGroup {
    return new FormGroup({
      languageName: new FormControl(language?.languageName || '', [Validators.required]),
      readingLevel: new FormControl(language?.readingLevel || '', [Validators.required]),
      writingLevel: new FormControl(language?.writingLevel || '', [Validators.required]),
      speakingLevel: new FormControl(language?.speakingLevel || '', [Validators.required])
    });
  }
editLanguage(language: LanguageResponse) {
  const formGroup = this.createFormGroup(language);
  this.editingForms.set(language.languageId, formGroup);
  this.isLanguageNewFormOpen.set(false);
  this.isLanguageEditFormOpen.set(true);
  this.editingLanguage = language;
}

isSaving = false; // Add this as a class property

saveLanguageProficiency() {
  if (this.isSaving) return; // Prevent double submission
  
  if (this.editingLanguage) {
    // Handle edit form
    const editForm = this.editingForms.get(this.editingLanguage.languageId);
    if (!editForm || editForm.invalid) {
      editForm?.markAllAsTouched();
      return;
    }

    this.isSaving = true; // Set loading state
    const formValue = editForm.value;
    const userGuid = this.userGuidId ?? "";

    const updateCommand: updateLanguage = {
      userGuid: userGuid,
      languageID: this.editingLanguage.languageId,
      languageName: formValue.languageName || '',
      languageReading: formValue.readingLevel || '',
      languageWriting: formValue.writingLevel || '',
      languageSpeaking: formValue.speakingLevel || ''
    };

    this.languageService.updateLanguage(updateCommand).subscribe({
      next: (response) => {
        const index = this.languageProficiencies.findIndex(l => l.languageId === this.editingLanguage.languageId);
        if (index !== -1) {
          this.languageProficiencies[index] = {
            languageId: this.editingLanguage.languageId,
            languageName: formValue.languageName || '',
            readingLevel: formValue.readingLevel || '',
            writingLevel: formValue.writingLevel || '',
            speakingLevel: formValue.speakingLevel || ''
          };
        }
        this.isLanguageEditFormOpen.set(false);
        this.editingForms.delete(this.editingLanguage.languageId);
        this.editingLanguage = null;
        this.loadLanguageInfo();
        this.isSaving = false; // Reset loading state
      },
      error: (error) => {
        console.error('Error updating language:', error);
        this.isSaving = false; // Reset loading state on error
      }
    });
  } else {
    if (this.languageProficiencies.length >= 3) {
      alert('You can only add up to 3 languages.');
      this.isLanguageNewFormOpen.set(false);
      return;
    }

    if (this.languageform.invalid) {
      this.languageform.markAllAsTouched();
      return;
    }

    this.isSaving = true; // Set loading state
    const formValue = this.languageform.value;
    const userGuid = this.userGuidId    
    const insertCommand: insertLanguage = {
      userGuid: userGuid,
      languageName: formValue.languageName || '',
      languageReading: formValue.readingLevel || '',
      languageWriting: formValue.writingLevel || '',
      languageSpeaking: formValue.speakingLevel || ''
    };

    this.languageService.insertLanguage(insertCommand).subscribe({
      next: (response) => {
        this.isLanguageNewFormOpen.set(false);
        this.resetForm();
        this.loadLanguageInfo();
        this.isSaving = false; // Reset loading state
      },
      error: (error) => {
        console.error('Error inserting language:', error);
        this.isSaving = false; // Reset loading state on error
      }
    });
  }
}


    cancelEdit(languageId: number) {
    this.editingForms.delete(languageId);
  }


   addNewLanguage() {
    this.isLanguageNewFormOpen.set(true);
    this.editingForms.clear(); // Close any open edit forms
  }


  ngOnInit(): void {
    //this.loadLanguageInfo();

  }



  saveNewLanguage() {
    const newForm = this.newLanguageForm;
    if (newForm.invalid) {
      newForm.markAllAsTouched();
      return;
    }

    const newLanguage: LanguageResponse = {
      languageId: this.nextId++,
      languageName: newForm.value.languageName || '',
      readingLevel: newForm.value.readingLevel || '',
      writingLevel: newForm.value.writingLevel || '',
      speakingLevel: newForm.value.speakingLevel || ''
    };

    this.languageProficiencies.push(newLanguage);
    this.isLanguageNewFormOpen.set(false);
    this.newLanguageForm.reset();
  }

  // New language form
  newLanguageForm = this.createFormGroup();



deleteLanguage(languageId: number) {
  if (this.isDeleting) return; // Prevent double click
  
  this.isDeleting = true;
  const command: deleteLanguage = {
    userGuid: this.userGuidId ?? "",
    l_ID: languageId
  };

  this.languageService.deleteLanguage(command).subscribe({
    next: () => {
      this.loadLanguageInfo();
      this.languageProficiencies = this.languageProficiencies.filter(l => l.languageId !== languageId);
      this.editingForms.delete(languageId);
      this.closeDeleteModal();
      this.isInfoAvailable = this.languageProficiencies.length > 0;
      this.isDeleting = false; // Reset flag after successful operation
    },
    error: (error: Error) => {
      this.isDeleting = false; // Reset flag in case of error too
      // Consider adding error handling here
    }
  });
}

  openDeleteModal(languageId: number) {
    this.editingLanguage = this.languageProficiencies.find(l => l.languageId === languageId);
    this.isDeleteModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeDeleteModal(){
    this.isDeleteModalOpen.set(false)
    document.body.style.overflow = ''
  }

  // Helper methods to get form controls for template
  getFormControl(form: FormGroup, controlName: string): FormControl {
    return form.get(controlName) as FormControl;
  }



resetForm() {
  this.languageform.reset();
  this.editingLanguage = null;

}


get languageControl(): FormControl {
  return this.languageform.get('languageName') as FormControl;
}

get readingControl(): FormControl {
  return this.languageform.get('readingLevel') as FormControl;
}

get writingControl(): FormControl {
  return this.languageform.get('writingLevel') as FormControl;
}

get speakingControl(): FormControl {
  return this.languageform.get('speakingLevel') as FormControl;
}

getEditFormControl(languageId: number, controlName: string): FormControl {
  return this.editingForms.get(languageId)?.get(controlName) as FormControl;
}

getErrorMessage(control: FormControl): string {
  if (control.hasError('required')) {
    if (control === this.languageControl || control === this.getEditFormControl(this.editingLanguage?.languageId, 'languageName')) {
      return 'Language cannot be empty.';
    }
    if (control === this.readingControl || control === this.getEditFormControl(this.editingLanguage?.languageId, 'readingLevel')) {
      return 'Please select Reading Proficiency.';
    }
    if (control === this.writingControl || control === this.getEditFormControl(this.editingLanguage?.languageId, 'writingLevel')) {
      return 'Please select Writing Proficiency.';
    }
    if (control === this.speakingControl || control === this.getEditFormControl(this.editingLanguage?.languageId, 'speakingLevel')) {
      return 'Please select Speaking Proficiency.';
    }
  }
  return '';
}

isFieldInvalid(control: FormControl): boolean {
  return control.invalid && (control.dirty || control.touched);
}

get languagesList() {
  return this.languages();
}

get proficiencyLevelsList() {
  return this.proficiencyLevels;
}
}

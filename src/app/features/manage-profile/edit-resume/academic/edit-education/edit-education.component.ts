import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged, finalize } from 'rxjs';
import { AccordionMainBodyComponent } from '../../../../../shared/components/accordion-main-body/accordion-main-body.component';
import { CheckboxComponent } from "../../../../../shared/components/checkbox/checkbox.component";
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { SelectboxComponent } from '../../../../../shared/components/selectbox/selectbox.component';
import { TextEditorComponent } from '../../../../../shared/components/text-editor/text-editor.component';
import { selectBoxItem, SelectItem } from '../../../../../shared/models/models';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';
import { EducationDetails } from './models/educationDeatils.model';
import { Education, EducationResponse } from './models/userEducation.model';
import { EducationService } from './services/education.service';
import {EducationSavePayload} from './models/educationSavePayload.model';
import { saveEduResponse } from './models/educationSave.model';
import { NoDetailsComponent } from '../../../../../shared/components/no-details/no-details.component';
import { deleteEducationResponse } from './models/deleteEducation.model';
import { ToasterService } from '../../../../../shared/services/toaster.service';
import { MultiSelectComponent } from "../../../../../shared/components/multi-select/multi-select.component";
import { autoSuggestionEduResponse, Data } from './models/autoSuggestionEduResponse.model';
import { provideTranslocoScope, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { convertToBanglaDigits } from '../../../../common/utility';

@Component({
  selector: 'app-edit-education',
  imports: [
    ReactiveFormsModule,
    TextEditorComponent,
    SelectboxComponent,
    InputComponent,
    CommonModule,
    AccordionMainBodyComponent,
    CheckboxComponent,
    NoDetailsComponent,
    MultiSelectComponent,
    TranslocoDirective
],
  providers: [provideTranslocoScope('editResumeAcademic')],
  templateUrl: './edit-education.component.html',
  styleUrl: './edit-education.component.scss'
})
export class EditEducationComponent implements OnChanges {

  private accordionService = inject(AccordionManagerService);
  private readonly fb = inject(FormBuilder);

  //isAcademicSummaryExpanded = false;
  id = "academicsummary"
  //isAcademicSummaryOpen = input(false);
  @Input() isAcademicSummaryOpen: boolean = false;
  isDeleteModalOpen = signal(false)
  isAcademicSummaryEditFormOpen = signal(false);
  summaryForms = signal<Map<number, FormGroup>>(new Map());
  isAcademicSummaryNewFormOpen = signal(false);
  @Output() onClose = new EventEmitter<void>();
  editingSummaries = signal<Set<number>>(new Set());
  isExpanded = false;
  @Output() addExperience = new EventEmitter<void>();
  isInEditMode = signal(true); // assuming you have this or similar
  editingSummary = signal<any>(null);
  academicSummaries = signal<Education[]>([]);
  degreeTitles = signal<selectBoxItem[]>([]);
  board = signal<selectBoxItem[]>([]);
  year = signal<selectBoxItem[]>([]);
  degreeList : any[] = []

  showForeignInstituteCountry = signal(false);
  userGuid = "ZiZuPid0ZRLyZ7S3YQ00PRg7MRgwPELyBTYxPRLzZESuYTU0BFPtBFVUIGL3Ung="
  educationService = inject(EducationService);
  educationLevels = signal<selectBoxItem[]>([]);
  currentlanguage = 'en';
  eduLevelId: number = 0;
  isAddButtonDisabled = signal(false);
  isBlueCollar = false
  isInfoAvailable: boolean = false;
  isFetchEducationCall = false;
  searchInputs: string[] = [];
  searchMajorInputs:string[] = [];
  convertToBanglaDigits = convertToBanglaDigits;

  summaryForm = this.fb.group({
    educations: this.fb.array([])
  });

  validationEduLevelMsg: string[] = [];
  validationDegreeMsg :string[] = [];
  validationMajorMsg :string[] = [];
  validationBoardMsg :string[] = [];
  validationInsMsg :string[] = [];
  validationCountryMsg :string[] = [];
  validationResultMsg :string[] = [];
  validationGradeMsg :string[] = [];
  validationScaleMsg :string[] = [];
  validationYearMsg :string[] = [];
  validationDurationMsg :string[] = [];
  validationAchievementMsg :string[] = [];

  selectedDeleteIndex = signal<number | null>(null);
  selectedDeleteEduId = signal<number | null>(null);
  isLoading = signal(true);
  toaster = inject(ToasterService);
  instituteSuggestions = signal<Data[]>([]);
  majorSuggestions = signal<Data[]>([]);
  currentLanguage  :string = 'en';

  constructor(private translocoService: TranslocoService)
  {
    if (this.isBlueCollar) {
      this.translocoService.setActiveLang('bn'); // Set 'bn' first
    }

    this.translocoService.langChanges$.subscribe((lang) => {
      this.currentLanguage = lang;
    });

  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.isAcademicSummaryOpen && !this.isOpen()) {
      this.toggle();
      this.populateYears();
      this.fetchUserEduInfo(this.userGuid);
    }
  }

  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    this.accordionService.toggle(this.id);
  }


  toggleDropdown() {
    this.isExpanded = !this.isExpanded;
  }

  handleAddExperience() {
    this.addExperience.emit();
  }

  result = signal([
    {
      label: 'First Division/Class',
      value: 15,
    },
    {
      label: 'Second  Division/Class',
      value: 14,
    },
    {
      label: 'Third Division/Class',
      value: 13,
    },
    {
      label: 'Grade',
      value: 11,
    },
    {
      label: 'Appeared',
      value: 12,
    },
    {
      label: 'Enrolled',
      value: 10,
    },
    {
      label: 'Awarded',
      value: 9,
    },
    {
      label: 'Do not mention',
      value: 0,
    },
    {
      label: 'Pass',
      value: 8,
    }
  ]);

  populateYears() {
    let yearList = this.year();
    for (let i = 2030; i >= 1970; i--) {
      yearList.push({ label: i.toString(), value: i });
    }
    this.year.set(yearList);
  }

  get gEf(): FormArray {
    return this.summaryForm.controls.educations;
  }

  getNewSummary(): FormGroup {
    return new FormGroup({
      major: new FormControl(''),
      educationLevel: new FormControl(0),
      degreeTitle: new FormControl(''),
      institute: new FormControl(''),
      country: new FormControl(''),
      marks: new FormControl(0),
      duration: new FormControl(''),
      result: new FormControl(-1),
      year: new FormControl(0),
      achievement: new FormControl(''),
      board: new FormControl(0),
      showDegeree: new FormControl(false),
      otherDegree: new FormControl(''),
      isForeign: new FormControl(false),
      scale: new FormControl(0),
      isOpen: new FormControl(false),
      isNew: new FormControl(false),
      eduTypeId: new FormControl(0),
      ed_ID: new FormControl(0),
    });
  }

  getEdId(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('ed_ID') as FormControl;
  }


  getMajor(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('major') as FormControl;
  }

  getElevel(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('educationLevel') as FormControl;
  }

  getDegree(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('degreeTitle') as FormControl;
  }

  getInstitute(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('institute') as FormControl;
  }

  getCountry(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('country') as FormControl;
  }

  getMarks(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('marks') as FormControl;
  }

  getDuration(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('duration') as FormControl;
  }

  getResult(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('result') as FormControl;
  }


  getYear(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('year') as FormControl;
  }

  getAchment(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('achievement') as FormControl;
  }

  getBoard(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('board') as FormControl;
  }

  getShowDeg(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('showDegeree') as FormControl;
  }

  getOtherDeg(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('otherDegree') as FormControl;
  }

  getIsFrgn(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('isForeign') as FormControl;
  }

  getScale(index: number): FormControl {
    return (this.gEf.controls.at(index) as any).get('scale') as FormControl;
  }

  getIsOpen(index: number): boolean {
    return (this.gEf.controls.at(index) as any).get('isOpen').value;
  }

  getEduTypeId(index: number): FormControl {
   // return (this.gEf.controls.at(index) as any).get('eduTypeId').value;
    return this.gEf.at(index).get('eduTypeId') as FormControl;
  }


  createEducation() {
    const form = this.getNewSummary();
    this.gEf.push(form);

  }

  createEducationForButtonClick() {
    this.isAddButtonDisabled.set(true);
    this.isInfoAvailable = true;
    const form = this.getNewSummary();
    form.get('isOpen')?.setValue(true);
    form.get('isNew')?.setValue(true);

    const length = this.gEf.length;
    this.searchMajorInputs[length]='';
    this.searchInputs[length]='';

    if(!this.isFetchEducationCall){
      this.fetchEducation(0, 0);
    }

    this.gEf.push(form);

  }


  getLabelByValue(value :any, parent:string){
    if(parent=='board'){
      const level = this.board().find(l => l.value === value);
      return level ? level.label : '';
    }
    else if(parent=='result'){
      const level = this.result().find(l => l.value === value);
      return level ? level.label : '';
    }
    else if(parent=='educationLevels'){
      const level = this.educationLevels().find(l => l.value === value);
      return level ? level.label : '';
    }
    else{
      return '';
    }
  }

  closeDeleteModal(index:number) {
    this.isDeleteModalOpen.set(false)
    document.body.style.overflow = ''
  }

  openDeleteModal(index  :number, eduId:number) {
    this.isDeleteModalOpen.set(true)
    document.body.style.overflow = 'hidden'

    this.selectedDeleteIndex.set(index);
    this.selectedDeleteEduId.set(eduId);

  }

  confirmDelete(){
    if (this.selectedDeleteIndex() !== null && this.selectedDeleteEduId() !== null) {
      this.educationService.deleteEducation(this.userGuid,this.selectedDeleteEduId()!)
      .subscribe({
        next: (response: deleteEducationResponse[]) => {
          let msg = '';

          if (response[0].eventType === 1) {
              if(this.currentLanguage==='en'){
                msg="Education deleted successfully!";
              }
              else{
                msg = "তথ্য সফলভাবে ডিলিট করা হয়েছে!"
              }
              this.toaster.show(msg,
                {
                  iconClass: 'lucide-check-circle',
                  imageUrl: 'images/check-circle.svg',
                  borderColor: 'bg-[#079455]'
              });
              this.gEf.removeAt(this.selectedDeleteIndex()!);
          }
          else{
              if(this.currentLanguage==='en'){
                msg="Education deleted failed!";
              }
              else{
                msg = "তথ্য মুছে ফেলা ব্যর্থ হয়েছে!"
              }
              this.toaster.show(msg,
                {
                  iconClass: 'lucide-check-circle',
                  imageUrl: 'images/x-circle.svg',
                  borderColor: 'bg-[#D92D20]'
              });

          }
          this.closeDeleteModal(this.selectedDeleteIndex()!);


        },
      });


    }
  }

  toggleForeignInstitute(event: Event) {
    const input = event.target as HTMLInputElement;
    this.showForeignInstituteCountry.set(input.checked);
  }

  fetchUserEduInfo(userId: string) {
    this.educationService.getUserEducation(userId)
      .pipe(
              finalize(() => this.isLoading.update(() => false))
      )
      .subscribe({
        next: (response: EducationResponse) => {
          if (response.event.eventData[0].value.length > 0) {
            this.isInfoAvailable  = true;
            this.academicSummaries.set(response.event.eventData[0].value);

            this.loadEducationInfo(response.event.eventData[0].value)

            this.fetchEducation(0, 0);
          }

        },
      });
  }

  loadEducationInfo(edus: Education[]) {
    edus.forEach((edu, i) => {
      this.createEducation();
       const isCustomDegree = !this.degreeTitles().some(d => d.value === edu.examOrDegreeOrTitle);
       this.searchMajorInputs[i] = edu.concentrationOrMajorOrGroup;

      this.gEf.at(i).patchValue({
        major: edu.concentrationOrMajorOrGroup,
        educationLevel: edu.levelOfEducation,
        degreeTitle:  isCustomDegree ? 'Others' : edu.examOrDegreeOrTitle,
        institute: edu.instituteName,
        country: edu.countryOfForeignUniversity,
        marks: edu.cgpaOrMarks,
        duration: edu.courseDuration,
        result: edu.result,
        year: edu.yearOfPassing,
        achievement: edu.achievement,
        board: edu.boardID,
        showDegeree: edu.showDegreeToEmployers,
        otherDegree: isCustomDegree ? edu.examOrDegreeOrTitle : '',
        isForeign: edu.isForeignInstitute,
        scale: edu.gradeScale,
        ed_ID  : edu.ed_ID,
      });

      this.searchInputs[i] = edu.instituteName;
    })
  }

  fetchEducation(edulevelValue: number, index:number) {
    this.educationService.getEducation(this.currentLanguage, edulevelValue)
      .subscribe({
        next: (response: EducationDetails) => {
          if (response.event.eventData[0].value.eduLevels.length > 0) {
            const temp = response.event.eventData[0].value;
            this.degreeList  =response.event.eventData[0].value.educationDegrees;
            this.isFetchEducationCall = true;

            this.board.set(temp.boardNames.map(a => <selectBoxItem>{ label: a.boardName, value: a.boardId }));

            if (edulevelValue != 0) {
              this.degreeTitles.set(temp.educationDegrees.map(a => <selectBoxItem>{ label: a.degreeName, value: a.degreeName }));
              this.degreeTitles().push({ label: 'Others', value: 'Others' });


              if(this.academicSummaries()[index]?.examOrDegreeOrTitle){
                  const savedDegree = this.academicSummaries()[index].examOrDegreeOrTitle;
                  setTimeout(() => {
                    const existsInList = this.degreeTitles().some(d => d.value === savedDegree);
                    if (existsInList) {
                      this.getDegree(index).setValue(savedDegree);
                    }
                    else{
                      this.getDegree(index).setValue('Others');
                      this.getOtherDeg(index).setValue(savedDegree);
                    }

                  },700);
              }

            }
            else {
              this.educationLevels.set(temp.eduLevels.map(a => <selectBoxItem>{ label: a.eduLevel, value: a.e_Code }));
            }

          }
        },
      });

  }

  editEducation(index: number, willEdit: boolean = false, eduLevel : number) {
    const formGroup = this.gEf.controls.at(index) as any;
    //(this.gEf.controls.at(index) as any).get('isOpen').setValue(willEdit);
    formGroup.get('isOpen').setValue(willEdit);


    if(willEdit){
      this.fetchEducation(eduLevel,index);
    }
    else{
        if (formGroup.get('isNew')?.value) {
          //this.isInfoAvailable = false
          this.gEf.removeAt(index);
        }
        else {
          formGroup.get('isOpen')?.setValue(false);
        }
       this.isAddButtonDisabled.set(false);
    }
  }

  onEducationLevelChange(eduLevelvalue: number, index?: number){
    if(index!=null){
        this.fetchEducation(eduLevelvalue,index);
    }
  }

  onDegreeChange(degree:string, index?: number) {

    if (typeof index === 'number') {
      if (degree === 'Others') {
        this.getEduTypeId(index).setValue(0);
      }else {
        if(this.degreeList.length>0){
            this.getEduTypeId(index).setValue(this.degreeList.find(d => d.degreeName === degree).educationType);
        }

      }
    } else {
      console.warn('Index is undefined.');
    }

  }

  dynamicMarksLabel(index: number): string {
    if(this.currentLanguage==='en'){
      if(this.getResult(index).value === 11){
        return 'CGPA';
      }
      else{
         return 'Marks(%)';
      }
    }
    else{
      if(this.getResult(index).value === 11){
        return 'সিজিপিএ';
      }
      else{
         return 'মার্কস(%)';
      }
    }

  }

  dynamicYearLabel(index: number): string {
    if(this.currentLanguage==='en'){
      if(this.getResult(index).value === 12){
        return 'Expected year of passing';
      }
      else{
        return 'Year of Passing';
      }
    }
    else{
      if(this.getResult(index).value === 12){
        return 'পাশ করার প্রত্যাশিত বছর';
      }
      else{
        return 'পাশ করার বছর ';
      }
    }

  }

  stripHtmlTags(html: string | null | undefined): string {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    //console.log(div.textContent)
    //console.log(div.innerText)

    return div.textContent || div.innerText || '';
  }

  saveAcademicSummary(index:number) {

      if(!this.validateEducation(index)){
        return;
      }
      else{
        this.makeValidationBlank(index);

        let degreeTitle = this.getDegree(index).value;
        if(this.getDegree(index).value=== 'Others'){
          degreeTitle = this.getOtherDeg(index).value;
        }

        //const isUpdate = this.getEdId(index).value > 0;
        let isUpdate  = true;
        const formGroup = this.gEf.controls.at(index) as any;
        if (formGroup.get('isNew')?.value){
          isUpdate  = false
        }

        const payload: EducationSavePayload = {
          userGuid: this.userGuid,
          education: degreeTitle,
          institute: this.getInstitute(index).value,
          subject: this.getMajor(index).value,
          passingYear: this.getYear(index).value,
          courseDuration: this.getDuration(index).value,
          eduLevel: this.getElevel(index).value,
          isForeignInstitute: this.getIsFrgn(index).value,
          result: this.getResult(index).value,
          percent_Mark: parseFloat(this.getMarks(index).value),
          grade_Scale: parseFloat(this.getScale(index).value),
          achievement: this.stripHtmlTags(this.getAchment(index).value),
          isSummaryView: this.getShowDeg(index).value,
          boardId: this.getBoard(index).value,
          foreignCountry: this.getCountry(index).value,
          educationType  : this.getEduTypeId(index).value,
          educationId: this.getEdId(index).value

        }
        //console.log(payload);

        if (isUpdate) {
          payload.educationId = this.getEdId(index).value;

          this.educationService.updateEducation(payload).subscribe({
              next: (response: saveEduResponse[]) => {
                let msg = '';
                if(response[0].eventType === 1){
                  if(this.currentLanguage === 'en'){
                    msg= 'Academic Summary updated successfully!';
                  }
                  else{
                    msg = 'শিক্ষাগত যোগ্যতা সফলভাবে আপডেট হয়েছে!';
                  }

                  this.toaster.show(msg,
                    {
                      iconClass: 'lucide-check-circle',
                      imageUrl: 'images/check-circle.svg',
                      borderColor: 'bg-[#079455]'
                  });

                }
                else{
                  if(this.currentLanguage === 'en'){
                    msg= 'Academic Summary updated failed!';
                  }
                  else{
                    msg = 'শিক্ষাগত যোগ্যতা আপডেট করতে ব্যর্থ হয়েছে!';
                  }
                  this.toaster.show(msg,
                    {
                      iconClass: 'lucide-check-circle',
                      imageUrl: 'images/x-circle.svg',
                      borderColor: 'bg-[#D92D20]'
                  });

                }

                (this.gEf.controls.at(index) as any).get('isOpen').setValue(false);
                this.isAddButtonDisabled.set(false);

              }
          });
        }
        else{
          this.educationService.saveEducation(payload).subscribe({
              next: (response: saveEduResponse[]) => {
                let msg = '';
                if(response[0].eventType === 1){

                  if(this.currentLanguage === 'en'){
                    msg= 'Academic Summary saved successfully!';
                  }
                  else{
                    msg = 'শিক্ষাগত যোগ্যতা সফলভাবে সংরক্ষণ হয়েছে!';
                  }

                  this.toaster.show(msg,
                    {
                      iconClass: 'lucide-check-circle',
                      imageUrl: 'images/check-circle.svg',
                      borderColor: 'bg-[#079455]'
                  });

                }
                else{
                  if(this.currentLanguage === 'en'){
                    msg= 'Academic Summary failed to save!';
                  }
                  else{
                    msg = 'শিক্ষাগত যোগ্যতা সংরক্ষণ করতে ব্যর্থ হয়েছে!';
                  }
                  this.toaster.show(msg,
                    {
                      iconClass: 'lucide-check-circle',
                      imageUrl: 'images/x-circle.svg',
                      borderColor: 'bg-[#D92D20]'
                  });
                }

                (this.gEf.controls.at(index) as any).get('isOpen').setValue(false);
                formGroup.get('isNew')?.setValue(false);
              },
          });
        }


      }

  }

  makeValidationBlank(index:number){
    this.validationEduLevelMsg[index] = '';
    this.validationDegreeMsg[index]  = '';
    this.validationMajorMsg[index]  = '';
    this.validationBoardMsg[index]  = '';
    this.validationInsMsg[index] = '';
    this.validationCountryMsg[index] = '';
    this.validationResultMsg[index] = '';
    this.validationGradeMsg[index] = '';
    this.validationScaleMsg[index]  = '';
    this.validationYearMsg[index]  = '';
    this.validationDurationMsg [index] = '';
    this.validationAchievementMsg[index]  = '';
  }

  validateEducation(index:number){

      let educationLevel = this.getElevel(index).value;
      let showDegree = this.getShowDeg(index).value;
      let degree = this.getDegree(index).value;
      let otherDegree = this.getOtherDeg(index).value;
      let major = this.getMajor(index).value;
      let board = this.getBoard(index).value;
      let institute = this.getInstitute(index).value;
      let isForeignInstitute = this.getIsFrgn(index).value;
      let country = this.getCountry(index).value;
      let result = this.getResult(index).value;
      let marks = this.getMarks(index).value;
      let scale = this.getScale(index).value;
      let year = this.getYear(index).value;
      let duration = this.getDuration(index).value;
      let achievement = this.getAchment(index).value;

      if(educationLevel === 0){
        if(this.currentLanguage === 'en'){
          this.validationEduLevelMsg[index]= "Please select education level";
        }
        else{
          this.validationEduLevelMsg[index]= "শিক্ষাগত যোগ্যতা খালি রাখা যাবে না।";
        }
        return false;
      }
      else{
        if(degree === ''){
          if(this.currentLanguage === 'en'){
            this.validationDegreeMsg[index] = "Exam/Degree Title cannot be empty";
          }
          else{
            this.validationDegreeMsg[index] = "পরীক্ষার / ডিগ্রী নাম খালি রাখা যাবে না।";
          }
          return false;
        }
        else{
          if(degree.length > 50){
            if(this.currentLanguage === 'en'){
              this.validationDegreeMsg[index] = "Exam/Degree Title maximum 50 characters."; //পরীক্ষার / ডিগ্রী নাম</strong></i>&nbsp; ৫০ অক্ষরের বেশি হবে না।
            }
            else{
              this.validationDegreeMsg[index] = "পরীক্ষার / ডিগ্রী নাম ৫০ অক্ষরের বেশি হবে না।"; //পরীক্ষার / ডিগ্রী নাম</strong></i>&nbsp; ৫০ অক্ষরের বেশি হবে না।
            }
            return false;
          }
        }

        if(degree==='Others'){
          if(otherDegree === ''){
            if(this.currentLanguage === 'en'){
              this.validationDegreeMsg[index] = "Exam/Degree Title cannot be empty"; //পরীক্ষার / ডিগ্রী নাম </strong></i> খালি রাখা যাবে না।
            }
            else{
              this.validationDegreeMsg[index] = "পরীক্ষার / ডিগ্রী নাম খালি রাখা যাবে না।"; //পরীক্ষার / ডিগ্রী নাম </strong></i> খালি রাখা যাবে না।
            }
            return false;
          }
          else{
            if(otherDegree.length > 50){
              if(this.currentLanguage === 'en'){
                this.validationDegreeMsg[index] = "Exam/Degree Title maximum 50 characters.";
              }
              else{
                this.validationDegreeMsg[index] = "পরীক্ষার / ডিগ্রী নাম ৫০ অক্ষরের বেশি হবে না।";
              }
              return false;
            }

          }

        }


      }

      if(educationLevel !== -3 && educationLevel !== -2){
        if(major === ''){
          if(this.currentLanguage === 'en'){
            this.validationMajorMsg[index] = "Please enter Concentration/Major/Group";
          }
          else{
            this.validationMajorMsg[index] = "মেজর / গ্রুপ এর নাম লিখুন।";
          }
          return false;
        }
        else{
          if(major.length > 150){
            if(this.currentLanguage === 'en'){
              this.validationMajorMsg[index] = "Concentration/Major/Group maximum 150 characters.";
            }
            else{
              this.validationMajorMsg[index] = "মেজর / গ্রুপ এর নাম ১৫০ অক্ষরের বেশি হবে না।";
            }
            return false;
          }
        }

      }

      if(educationLevel === 1 || educationLevel === 2 || educationLevel === -2 || educationLevel === -3){
        if(board === 0){
          if(this.currentLanguage === 'en'){
            this.validationBoardMsg[index] = "Board cannot be empty.";
          }
          else{
            this.validationBoardMsg[index] = "বোর্ড নির্বাচন করুন।";
          }
          return false;
        }
      }

      if(institute === ''){
        if(this.currentLanguage === 'en'){
          this.validationInsMsg[index] = "Please enter Institute Name";
        }
        else{
          this.validationInsMsg[index] = "শিক্ষা প্রতিষ্ঠানের নাম লিখুন।";
        }
        return false;
      }
      else{
        if(institute.length > 100){
          if(this.currentLanguage === 'en'){
            this.validationInsMsg[index] = "Institute Name maximum 100 characters.";
          }
          else{
            this.validationInsMsg[index] = "শিক্ষা প্রতিষ্ঠানের নাম ১০০ অক্ষরের বেশি হবে না।";
          }
          return false;
        }
      }

      if(isForeignInstitute){
        if(country === ''){
          if(this.currentLanguage === 'en'){
            this.validationCountryMsg[index] = "Please type Country Name.";
          }
          else{
            this.validationCountryMsg[index] = "দেশের নাম টাইপ করুন।";
          }
          return false;
        }
        else{
          if(country.length > 50){
            if(this.currentLanguage === 'en'){
              this.validationCountryMsg[index] = "Country Name maximum 50 characters";
            }
            else{
              this.validationCountryMsg[index] = "বিদেশী ইউনিভার্সিটির দেশের নাম ৫০ অক্ষরের বেশি হবে না।";
            }
            return false;

          }
        }
      }

      if(result === -1){
        if(this.currentLanguage === 'en'){
          this.validationResultMsg[index] = "Please select Result";
        }
        else{
          this.validationResultMsg[index] = "পরীক্ষার ফলাফল নির্বাচন করুন";
        }

        return false;
      }
      else if(result === 11){
        if(marks===0){
          if(this.currentLanguage === 'en'){
            this.validationGradeMsg[index] = "Please enter CGPA"; //সিজিপিএ </strong></i>&nbsp; লিখুন।
          }
          else{
            this.validationGradeMsg[index] = "সিজিপিএ লিখুন"; //সিজিপিএ </strong></i>&nbsp; লিখুন।
          }
          return false;
        }
        else{
          if(marks>10){
            if(this.currentLanguage === 'en'){
              this.validationGradeMsg[index] = "Please enter valid CGPA";
            }
            else{
              this.validationGradeMsg[index] = "সঠিক সিজিপিএ লিখুন।";
            }
            return false;
          }
          else if(marks < 1){
            if(this.currentLanguage === 'en'){
               this.validationGradeMsg[index] = "Please enter valid CGPA";
            }
            else{
              this.validationGradeMsg[index] = "সঠিক সিজিপিএ লিখুন";
            }
            return false;
          }

          if(parseInt(scale) === 0){
            if(this.currentLanguage === 'en'){
               this.validationScaleMsg[index] = "Please enter Grade Scale"; //গ্রেড স্কেল</strong></i>&nbsp; লিখুন।
            }
            else{
               this.validationScaleMsg[index] = "গ্রেড স্কেল লিখুন।"; //গ্রেড স্কেল</strong></i>&nbsp; লিখুন।
            }
            return false;
          }
          else{
            if(parseInt(scale) > 10 ){
              if(this.currentLanguage === 'en'){
                this.validationScaleMsg[index] = "Please enter valid Grade Scale";
              }
              else{
                this.validationScaleMsg[index] = "সঠিক তথ্য দিন।";
              }

              return false;
            }
          }

          if(parseFloat(scale) < parseFloat(marks)){
            this.validationGradeMsg[index] = "Grade Scale will be greater than CGPA";
            return false;
          }
        }

      }
      else if(result === 13 || result === 14 || result === 15){
        if(marks===0){
          if(this.currentLanguage==='en'){
            this.validationGradeMsg[index] = "Please enter CGPA";
          }
          else{
            this.validationGradeMsg[index] = "সিজিপিএ লিখুন।";
          }
          return false;
        }
        else{

          if(parseFloat(marks) > 100){
            if(this.currentLanguage==='en'){
              this.validationGradeMsg[index] = "Please enter valid Marks"; //সঠিক <i><strong>মার্কস</strong></i>&nbsp; লিখুন।
            }
            else{
              this.validationGradeMsg[index] = "সঠিক মার্কস লিখুন।";
            }
            return false;
          }
          else if(marks < 1){
            if(this.currentLanguage==='en'){
               this.validationGradeMsg[index] = "Please enter valid Marks"; //সঠিক <i><strong>মার্কস</strong></i>&nbsp; লিখুন।
            }
            else{
              this.validationGradeMsg[index] = "সঠিক মার্কস লিখুন।";
            }

            return false;
          }
        }
      }

      if(year=== 0){
        if(this.currentLanguage==='en'){
          this.validationYearMsg[index] = "Please select Year of Passing";
        }
        else{
          this.validationYearMsg[index] = "পাশ করার বছর নির্বাচন করুন।"
        }
        return false;
      }

      if(!this.isBlueCollar){
        if(duration !== 0){
          if(duration.length > 50){
            if(this.currentLanguage==='en'){
               this.validationDurationMsg[index] = "Duration maximum 50 characters."; //সময়কাল</strong></i>&nbsp; ৫০ অক্ষরের বেশি হবে না।
            }
            else{
               this.validationDurationMsg[index] = "সময়কাল ৫০ অক্ষরের বেশি হবে না।";
            }
            return false;
          }
        }

        if(achievement!==''){
          if(achievement.length > 100){
            if(this.currentLanguage==='en'){
               this.validationAchievementMsg[index] = "Achievement maximum 100 characters.";
            }
            else{
               this.validationAchievementMsg[index] = "কৃতিত্ব ১০০ অক্ষরের বেশি হবে না।"
            }
            return false;
          }
        }
      }


      return true;




  }

  getInstitutenames(searchData:string, index:number){
    //console.log(searchData)
    const instituteNamePayload = {
        condition: "",
        banglaField: "",
        con1: "",
        examTitle: "",
        langType: "",
        param: "5",
        strData: searchData
    };

    this.educationService.getEduAutoSuggestion(instituteNamePayload)
    .subscribe({
      next: (response  : autoSuggestionEduResponse) => {
        if(response.event.eventData[0].value.length > 0){
          this.instituteSuggestions.set(response.event.eventData[0].value);
        }
      },
    });

  }

  get instituteSelectItems(): SelectItem[] {
    const suggestions = this.instituteSuggestions();
    if (!Array.isArray(suggestions)) return [];

    return suggestions
    .flatMap(item => Array.isArray(item.instituteResponse) ? item.instituteResponse : [])
    .map(ins => ({
      label: ins.instituteName,
      value: ins.instituteID
    }));
  }

  onInstituteSelect($event: SelectItem[], index: number) {
    //const selected = $event?.[1];
    const validItems = $event.filter(item => typeof item === 'object' && item?.label && item?.value);
    const selected = validItems[0];
    if (selected) {
      this.getInstitute(index).setValue(selected.label);             // ✅ update FormControl
      this.searchInputs[index] = selected.label;                 // ✅ update displayed text
    } else {
      this.getInstitute(index).setValue('');
      this.searchInputs[index] = '';
    }
  }

  onInstituteInputBlur(typedValue: string, index: number) {
    if (typedValue) {
      this.getInstitute(index).setValue(typedValue);
      this.searchInputs[index] = typedValue;
    } else {
      this.getInstitute(index).setValue('');
      this.searchInputs[index] = '';
    }
  }

  getMajorGroups(searchData:string, index:number){
    //console.log(searchData)
    const majorGroupPayload = {
        condition: "",
        banglaField: "",
        con1: "",
        examTitle: "",
        langType: "",
        param: "6",
        strData: searchData
    };

    this.educationService.getEduAutoSuggestion(majorGroupPayload)
    .subscribe({
      next: (response  : autoSuggestionEduResponse) => {
        if(response.event.eventData[0].value.length > 0){
          this.majorSuggestions.set(response.event.eventData[0].value);
        }
      },
    });

  }

  get majorSelectItems(): SelectItem[] {
    const suggestions = this.majorSuggestions();
    if (!Array.isArray(suggestions)) return [];

    return suggestions
    .flatMap(item => Array.isArray(item.majorSubjectResponse) ? item.majorSubjectResponse : [])
    .map(maj => ({
      label: maj.majoR_Name,
      value: maj.majoR_ID
    }));
  }

  onMajorSelect($event: SelectItem[], index: number) {
    //const selected = $event?.[1];
    const validItems = $event.filter(item => typeof item === 'object' && item?.label && item?.value);
    const selected = validItems[0];
    if (selected) {
      this.getMajor(index).setValue(selected.label);             // ✅ update FormControl
      this.searchMajorInputs[index] = selected.label;                 // ✅ update displayed text
    } else {
      this.getMajor(index).setValue('');
      this.searchMajorInputs[index] = '';
    }
  }

  onMajorInputBlur(typedValue: string, index: number) {
    if (typedValue) {
      this.getMajor(index).setValue(typedValue);
      this.searchMajorInputs[index] = typedValue;
    } else {
      this.getMajor(index).setValue('');
      this.searchMajorInputs[index] = '';
    }
  }

}

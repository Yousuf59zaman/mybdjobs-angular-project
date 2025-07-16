import { Component, inject, Input, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SelectboxComponent } from '../../../../../shared/components/selectbox/selectbox.component';
import { DateRangePickerComponent } from '../../../../../shared/components/date-range-picker/date-range-picker.component';
import { CommonModule, DatePipe } from '@angular/common';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { DeleteTrainingInfo, InsertTrainingInfoCommand, TrainingInfoQuery, TrainingSummary, UpdateTrainingInfoCommand } from './model/training';
import { TrainingService } from './service/training.service';
import { CookieService } from '../../../../../core/services/cookie/cookie.service';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';
import { NoDetailsComponent } from "../../../../../shared/components/no-details/no-details.component";


@Component({
 selector: 'app-training',
 standalone: true,
 imports: [SelectboxComponent, DateRangePickerComponent, CommonModule, InputComponent, TranslocoModule, ReactiveFormsModule, NoDetailsComponent],
 providers: [provideTranslocoScope('editResumeTraining')],
 templateUrl: './training.component.html',
 styleUrls: ['./training.component.scss']
})
export class TrainingComponent {
 @Input() UserGuid!: string;
 @Input() set isTrainingFormOpen(value: boolean) {
   this._isTrainingFormOpen.set(value);
 }
 get isTrainingFormOpen(): WritableSignal<boolean> {
   return this._isTrainingFormOpen;
 }
 private _isTrainingFormOpen = signal(false);


 isTrainingExpanded = false;
 calendarVisible = false;
 private id = "education-training";
 isAddTrainingFormOpen = signal(false);
 isDeleteModalOpen = signal(false);
 isInfoAvailable=false;
 selectedTrainingId: number | null = null;
 private accordionService = inject(AccordionManagerService);
 formSubmitted = false;


 selectedStartDate: Date | null = null;
 selectedEndDate: Date | null = null;
 dateRangeString = '';


 readonly MAX_TRAININGS = 20;
 trainingSummaries: TrainingSummary[] = [];
 editingSummary: TrainingSummary | null = null;
 nextId = 1;


 trainingform = new FormGroup({
   id: new FormControl<number | null>(null),
   title: new FormControl('', [Validators.required, Validators.minLength(2)]),
   country: new FormControl('', [Validators.required, Validators.minLength(2)]),
   topics: new FormControl(''),
   year: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4}$')]),
   institute: new FormControl('', [Validators.required, Validators.minLength(2)]),
   duration: new FormControl(''),
   location: new FormControl('')
 });


 constructor(private trainingService: TrainingService, private cookieService: CookieService) { }


 // Form control getters
 get yearControl(): FormControl {
   return this.trainingform.get('year') as FormControl;
 }


 get titleControl(): FormControl {
   return this.trainingform.get('title') as FormControl;
 }


 get countryControl(): FormControl {
   return this.trainingform.get('country') as FormControl;
 }


 get topicsControl(): FormControl {
   return this.trainingform.get('topics') as FormControl;
 }


 get instituteControl(): FormControl {
   return this.trainingform.get('institute') as FormControl;
 }


 get durationControl(): FormControl {
   return this.trainingform.get('duration') as FormControl;
 }


 get locationControl(): FormControl {
   return this.trainingform.get('location') as FormControl;
 }


 get titleErrorMessage(): string {
   if (this.titleControl.hasError('required')) {
     return 'Training Title cannot be empty';
   }
   if (this.titleControl.hasError('minlength')) {
     return 'Training Title must be at least 2 characters';
   }
   return '';
 }


 get countryErrorMessage(): string {
   if (this.countryControl.hasError('required')) {
     return 'Country cannot be empty';
   }
   if (this.countryControl.hasError('minlength')) {
     return 'Country must be at least 2 characters';
   }
   return '';
 }


 get yearErrorMessage(): string {
   if (this.yearControl.hasError('required')) {
     return 'Please enter Training Year';
   }
   if (this.yearControl.hasError('pattern')) {
     return 'Please enter a valid year';
   }
   return '';
 }


 get instituteErrorMessage(): string {
   if (this.instituteControl.hasError('required')) {
     return 'Please enter Institute Name';
   }
   if (this.instituteControl.hasError('minlength')) {
     return 'Institute Name must be at least 2 characters';
   }
   return '';
 }




 ngOnInit(): void {
   this.loadTraining();
 }


 loadTraining(): void {


   const query: TrainingInfoQuery = {
     UserGuid: 'ZRDhZ7YxZEYyITPbBQ00PFPiMTDhBTUyPRmbPxdxYiObIFZ9BFPtBFVUIGL3Ung='
   };
   // const rawGuid = this.cookieService.getCookie('MybdjobsGId') || 'ZiZuPid0ZRLyZ7S3YQ00PRg7MRgwPELyBTYxPRLzZESuYTU0BFPtBFVUIGL3Ung%3D'; // for development only
   // this.userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
   // console.log('User GUID ID Photo Component:', this.userGuidId);


   this.trainingService.getTrainingInfo(query).subscribe({
     next: (summaries) => {
       this.trainingSummaries = summaries;
       if (summaries && summaries.length > 0) {
         const summary = summaries[0];
         this.isInfoAvailable = true;
         this.trainingform.patchValue({
           id:summary.t_ID,
           title: summary.trainingTitle,
           country: summary.country,
           topics: summary.topicsCovered,
           year: summary.trainingYear.toString(),
           institute: summary.institute,
           duration: summary.duration,
           location: summary.location
         });
       } else {
         console.log('No summaries received from API');
         this.isInfoAvailable = false;
       }
     },
     error: (error) => {
       console.error('Error loading training summaries:', error);
       this.isInfoAvailable = false;
     },
     complete: () => {
       console.log('API call completed');
     }
   });
 }


 year = signal([
   { label: '2010', value: '2010' },
   { label: '2011', value: '2011' },
   { label: '2012', value: '2012' },
   { label: '2013', value: '2013' },
   { label: '2014', value: '2014' },
   { label: '2015', value: '2015' },
   { label: '2016', value: '2016' },
   { label: '2017', value: '2017' },
   { label: '2018', value: '2018' },
   { label: '2019', value: '2019' },
   { label: '2020', value: '2020' },
   { label: '2021', value: '2021' },
   { label: '2022', value: '2022' },
   { label: '2023', value: '2023' },
   { label: '2024', value: '2024' },
   { label: '2025', value: '2025' },
   { label: '2026', value: '2026' },
   { label: '2027', value: '2027' },
   { label: '2028', value: '2028' },
   { label: '2029', value: '2029' },
   { label: '2030', value: '2030' }
 ]);


 toggleTrainingSummary() {
   this.isTrainingExpanded = !this.isTrainingExpanded;
   if (!this.isTrainingExpanded) {
     this.closeTrainingForm();
   }
 }


  closeDeleteModal(){
    this.isDeleteModalOpen.set(false)
    this.selectedTrainingId = null;
    document.body.style.overflow = ''
  }
   openDeleteModal(){
    this.isDeleteModalOpen.set(true)
    document.body.style.overflow = 'hidden'
  }

 openAddTrainingForm() {
   this.isAddTrainingFormOpen.set(true);
   this.isTrainingFormOpen.set(false);
   this.editingSummary = null;
   this.trainingform.reset();
   this.isTrainingExpanded = true;
   this.calendarVisible = false;
 }


 editSummary(summary: TrainingSummary) {
   this.editingSummary = summary;
   this.isTrainingFormOpen.set(true);
   this.isAddTrainingFormOpen.set(false);
   this.isTrainingExpanded = true;
   this.calendarVisible = false;


   this.trainingform.patchValue({
     id: summary.t_ID,
     title: summary.trainingTitle,
     country: summary.country,
     topics: summary.topicsCovered,
     year: summary.trainingYear.toString(),
     institute: summary.institute,
     duration: summary.duration,
     location: summary.location
   });


   this.dateRangeString = summary.duration;
 }


 saveTrainingSummary() {
 this.formSubmitted = true;
 if (this.trainingform.invalid) {
   this.trainingform.markAllAsTouched();
   return;
 }


 const formValue = this.trainingform.value;


 if (this.editingSummary) {
   const updateCmd: UpdateTrainingInfoCommand = {
     trainingId: this.editingSummary.t_ID,
     trainingTitle: formValue.title || '',
     country: formValue.country || '',
     topicsCovered: formValue.topics || '',
     trainingYear: parseInt(formValue.year || '0', 10),
     institute: formValue.institute || '',
     duration: formValue.duration || '',
     location: formValue.location || '',
     userGuid: 'ZRDhZ7YxZEYyITPbBQ00PFPiMTDhBTUyPRmbPxdxYiObIFZ9BFPtBFVUIGL3Ung='
   };


   this.trainingService.updateTrainingInfo(updateCmd).subscribe({
     next: (response) => {
       console.log('Update Response:', response);
       const successMsg = response.some(
         (r: any) =>
           r.eventType === 1 &&
           r.eventData.some((d: any) => d.key === 'Message' && d.value.includes('successfully updated'))
       );
       const errorMsg = response.some(
         (r: any) =>
           r.eventType === 1 &&
           r.eventData.some((d: any) => d.key === 'Event' && d.value.includes('No records were updated'))
       );


       if (successMsg && !errorMsg) {
         // Update local state
         const idx = this.trainingSummaries.findIndex(s => s.t_ID === this.editingSummary!.t_ID);
         if (idx > -1) {
           this.trainingSummaries[idx] = {
             ...this.trainingSummaries[idx],
             trainingTitle: updateCmd.trainingTitle,
             country: updateCmd.country,
             topicsCovered: updateCmd.topicsCovered,
             trainingYear: updateCmd.trainingYear,
             institute: updateCmd.institute,
             duration: updateCmd.duration,
             location: updateCmd.location
           };
         }
         this.closeTrainingForm();
       } else {
         console.error('Update failed:', response);
       }
     },
     error: (error) => {
       console.error('Update failed:', error);
     }
   });
 }else {
     const insertCmd: InsertTrainingInfoCommand = {
       t_ID: 0,
       trainingTitle: formValue.title || '',
       country: formValue.country || '',
       topicsCovered: formValue.topics || '',
       trainingYear: parseInt(formValue.year || '0', 10),
       institute: formValue.institute || '',
       duration: formValue.duration || '',
       location: formValue.location || '',
       userGuid: 'ZRDhZ7YxZEYyITPbBQ00PFPiMTDhBTUyPRmbPxdxYiObIFZ9BFPtBFVUIGL3Ung='
     };
     console.log('Insert Command:', insertCmd); // Debug log


     this.trainingService.insertTrainingInfo(insertCmd).subscribe({
       next: (response: any) => {
         console.log('Insert Response:', response);
         const newSummary: TrainingSummary = {
           t_ID: response.t_ID || this.getNextId(),
           trainingTitle: insertCmd.trainingTitle,
           country: insertCmd.country,
           topicsCovered: insertCmd.topicsCovered,
           trainingYear: insertCmd.trainingYear,
           institute: insertCmd.institute,
           duration: insertCmd.duration,
           location: insertCmd.location
         };
         this.trainingSummaries.push(newSummary);
         this.closeTrainingForm();
       },
       error: (error) => {
         console.error('Insert failed:', error);
       }
     });
   }
 }



 private getNextId(): number {
   return this.trainingSummaries.length > 0
     ? Math.max(...this.trainingSummaries.map(s => s.t_ID)) + 1
     : 1;
 }


//  deleteSummary(trainingId: number) {
//    this.trainingSummaries = this.trainingSummaries.filter(s => s.t_ID !== trainingId);
//    if (this.editingSummary?.t_ID === trainingId) {
//      this.closeTrainingForm();
//    }
//  }

deleteSummary(trainingId: number) {

  const deleteCommand: DeleteTrainingInfo = {
    userGuid: 'ZRDhZ7YxZEYyITPbBQ00PFPiMTDhBTUyPRmbPxdxYiObIFZ9BFPtBFVUIGL3Ung=',
    trainingID: trainingId
  };

  this.trainingService.deleteTrainingInfo(deleteCommand).subscribe({
    next: () => {
      this.trainingSummaries = this.trainingSummaries.filter(s => s.t_ID !== trainingId);
      if (this.editingSummary?.t_ID === trainingId) {
        this.closeTrainingForm();
        window.location.reload();
      }
    },
    error: (err) => {
      console.error('Failed to delete training summary', err);
      alert('An error occurred while deleting. Please try again.');
    }
  });
}

 closeTrainingForm() {
   this.isAddTrainingFormOpen.set(false);
   this.isTrainingFormOpen.set(false);
   this.editingSummary = null;
   this.trainingform.reset();
   this.dateRangeString = '';
   this.selectedStartDate = null;
   this.selectedEndDate = null;
   this.calendarVisible = false;
   this.formSubmitted = false;
 }


 toggleCalendar() {
   this.calendarVisible = !this.calendarVisible;
 }


 onStartDateChange(date: Date | null) {
   this.selectedStartDate = date;
   this.updateDateRangeString();
 }


 onEndDateChange(date: Date | null) {
   this.selectedEndDate = date;
   this.updateDateRangeString();
 }


 updateDateRangeString() {
   if (this.selectedStartDate && this.selectedEndDate) {
     const diffTime = Math.abs(this.selectedEndDate.getTime() - this.selectedStartDate.getTime());
     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
     this.dateRangeString = diffDays.toString();
     this.trainingform.patchValue({ duration: diffDays.toString() });
   } else if (this.selectedStartDate) {
     this.dateRangeString = this.formatDate(this.selectedStartDate);
   } else {
     this.dateRangeString = '';
   }
 }


 formatDate(date: Date): string {
   return date.toLocaleDateString();
 }


 canAddMoreTrainings(): boolean {
   return this.trainingSummaries.length < this.MAX_TRAININGS;
 }


 getNextTrainingNumber(): number {
   return this.trainingSummaries.length + 1;
 }


 getTrainingNumber(id: number): number {
   const index = this.trainingSummaries.findIndex(summary => summary.t_ID === id);
   return index + 1;
 }


 confirmDelete() {
   if (this.selectedTrainingId !== null) {
     this.deleteSummary(this.selectedTrainingId);
     this.closeDeleteModal();
   }
 }


}



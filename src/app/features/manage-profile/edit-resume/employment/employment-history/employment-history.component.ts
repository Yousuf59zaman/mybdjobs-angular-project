import { Component, EventEmitter, inject, input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgClass } from '@angular/common';
import { TextEditorComponent } from '../../../../../shared/components/text-editor/text-editor.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { AccordionMainBodyComponent } from '../../../../../shared/components/accordion-main-body/accordion-main-body.component';
import { DateSingleDatePickerComponent } from '../../../../../shared/components/date-single-date-picker/date-single-date-picker.component';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';
import { NoDetailsSummaryComponent } from '../../academic/no-details-training-summary/no-details-training-summary.component';


@Component({
  selector: 'app-employment-history',
   imports: [
    TextEditorComponent,
    // NoDetailsSummaryComponent,
    InputComponent,
    DateSingleDatePickerComponent,
    AccordionMainBodyComponent,
    NgClass
  ],
  templateUrl: './employment-history.component.html',
  styleUrl: './employment-history.component.scss'
})
export class EmploymentHistoryComponent implements OnChanges {

  isEmploymentHistoryOpen = input(false);
  isEmploymentHistoryEditFormOpen = signal(false);
  isEmploymentHistoryNewFormOpen = signal(false);
  private id = "employmenthistory"
  private accordionService = inject(AccordionManagerService)
  
  ngOnChanges(changes: SimpleChanges): void {
    if(this.isEmploymentHistoryOpen() && !this.isOpen()) {
      this.toggle();
    }
  }

  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    this.accordionService.toggle(this.id);
  }

  // isAcademicSummaryExpanded = false;
  @Output() onClose = new EventEmitter<void>()
 
  isExpanded = false;
  @Output() addExperience = new EventEmitter<void>();
  
  toggleDropdown() {
    this.isExpanded = !this.isExpanded;
  }
  
  handleAddExperience() {
    this.addExperience.emit();
  }
  
  // toggleAcademicSummary() {
  //   this.isAcademicSummaryExpanded = !this.isAcademicSummaryExpanded;
  // }

  closeForm(){
    this.onClose.emit()
   }

  onStartDateChanged(date: Date | null): void {
    console.log('Selected Start Date:', date);
  }
  



}

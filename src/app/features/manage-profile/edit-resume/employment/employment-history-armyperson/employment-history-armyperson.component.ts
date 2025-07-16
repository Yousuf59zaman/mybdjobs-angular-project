import { ChangeDetectorRef, Component, EventEmitter, inject, input, Output, signal, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { SelectboxComponent } from '../../../../../shared/components/selectbox/selectbox.component';
import { DateSingleDatePickerComponent } from '../../../../../shared/components/date-single-date-picker/date-single-date-picker.component';
import { AccordionMainBodyComponent } from '../../../../../shared/components/accordion-main-body/accordion-main-body.component';
import { AccordionManagerService } from '../../../../../shared/services/accordion.service';
import { NoDetailsSummaryComponent } from '../../academic/no-details-training-summary/no-details-training-summary.component';

@Component({
  selector: 'app-employment-history-armyperson',
  imports: [
    // NoDetailsSummaryComponent,
    InputComponent,
    SelectboxComponent,
    DateSingleDatePickerComponent,
    NgClass,
    AccordionMainBodyComponent
],
  templateUrl: './employment-history-armyperson.component.html',
  styleUrl: './employment-history-armyperson.component.scss'
})
export class EmploymentHistoryArmypersonComponent {

  isEmploymentArmyHistoryOpen = input(false);
  isEmploymentArmyHistoryEditFormOpen = signal(false);
  isEmploymentArmyHistoryNewFormOpen = signal(false);

  private id = "employmentarmyhistory"
  private accordionService = inject(AccordionManagerService)
  
  ngOnChanges(changes: SimpleChanges): void {
    if(this.isEmploymentArmyHistoryOpen() && !this.isOpen()) {
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
  placeholderText: string = 'Select your BA no';
  private resizeObserver!: ResizeObserver;
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
  this.updatePlaceholder();
  this.resizeObserver = new ResizeObserver(() => {
    this.updatePlaceholder();
    this.cd.detectChanges(); 
  });
  this.resizeObserver.observe(document.body);
 }
  ngOnDestroy() {
  this.resizeObserver?.disconnect()
 }

  updatePlaceholder() {
  this.placeholderText = window.innerWidth < 1024 ? 'Select' : 'Select your BA no';
 }

  
   toggleDropdown() {
      this.isExpanded = !this.isExpanded;
    }
    
   handleAddExperience() {
      this.addExperience.emit();
    }
    
  //  toggleAcademicSummary() {
  //     this.isAcademicSummaryExpanded = !this.isAcademicSummaryExpanded;
  //   }
  
   closeForm(){
      this.onClose.emit()
     }
  
   onStartDateChanged(date: Date | null): void {
      console.log('Selected Start Date:', date);
    }
    

}

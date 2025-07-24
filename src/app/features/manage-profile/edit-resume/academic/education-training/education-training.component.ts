import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import { EditEducationComponent } from "../edit-education/edit-education.component";
import { TabsElementModel } from '../../../../common/edit-resume-tabs.const';
import { TrainingComponent } from '../training/training.component';
import { ProfessionalCertificationSummaryComponent } from '../ProfessionalCertificate/professional-certification-summary/professional-certification-summary.component';


@Component({
  selector: 'app-education-training',
  imports: [
    // NgClass,
    EditEducationComponent,
    TrainingComponent,
    ProfessionalCertificationSummaryComponent
],
  templateUrl: './education-training.component.html',
  styleUrl: './education-training.component.scss'
})
export class EducationTrainingComponent implements OnChanges {

  subTabDetails = input<TabsElementModel>({} as TabsElementModel);
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['subTabDetails'] && changes['subTabDetails'].currentValue) {
    console.log('sub',this.subTabDetails());
    this.scrollToSection(this.subTabDetails().id.toString());
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 180;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    // if (element) {
    //   element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // }
  }
}

import { Component, input, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import { EmploymentHistoryComponent } from "../employment-history/employment-history.component";
import { EmploymentHistoryArmypersonComponent } from "../ArmyEmployment/employment-history-armyperson/employment-history-armyperson.component";
import { TabsElementModel } from '../../../../common/edit-resume-tabs.const';

@Component({
  selector: 'app-employment',
  imports: [
    // NgClass,
    EmploymentHistoryComponent,
    EmploymentHistoryArmypersonComponent
],
  templateUrl: './employment.component.html',
  styleUrl: './employment.component.scss'
})
export class EmploymentComponent {

  subTabDetails = input<TabsElementModel>({} as TabsElementModel);

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['subTabDetails'] && changes['subTabDetails'].currentValue) {
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

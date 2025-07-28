import { Component, input, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import { SkillComponent } from "../SkillComponent/skill/skill.component";
import { LanguageProficiencyComponent } from "../language-proficiency/language-proficiency.component";
import { TabsElementModel } from '../../../../common/edit-resume-tabs.const';
import { ReferencesComponent } from '../ReferenceComponent/references/references.component';
import { LinkAccountComponent } from "../link-account/link-account/link-account.component";


@Component({
  selector: 'app-other-info',
  imports: [
    SkillComponent,
    LanguageProficiencyComponent,
    ReferencesComponent,
    LinkAccountComponent
],
  templateUrl: './other-info.component.html',
  styleUrl: './other-info.component.scss'
})
export class OtherInfoComponent {

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

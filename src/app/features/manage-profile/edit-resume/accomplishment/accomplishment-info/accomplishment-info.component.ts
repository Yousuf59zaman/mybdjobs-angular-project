import { Component, input, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import { PortfolioComponent } from "../portfolio/portfolio.component";
import { PublicationsComponent } from "../publications/publications.component";
import { AwardsComponent } from "../awards/awards.component";
import { ProjectComponent } from "../project/project.component";
import { OthersComponent } from "../others/others.component";
import {TabsElementModel} from '../../../../common/edit-resume-tabs.const';

@Component({
  selector: 'app-accomplishment-info',
  imports: [
    PortfolioComponent,
    PublicationsComponent,
    AwardsComponent,
    ProjectComponent,
    OthersComponent
],
  templateUrl: './accomplishment-info.component.html',
  styleUrl: './accomplishment-info.component.scss'
})
export class AccomplishmentInfoComponent {

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

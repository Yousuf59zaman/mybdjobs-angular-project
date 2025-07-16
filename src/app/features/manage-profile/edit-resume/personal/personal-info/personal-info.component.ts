import { Component, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CareerApplicationInfoComponent } from "../career-application-info/career-application-info.component";
import { PreferredAreasComponent } from "../preferred-areas/preferred-areas/preferred-areas.component";
import { OtherRelevantInfoComponent } from "../other-relevant-info/other-relevant-info.component";
import { TabsElementModel } from '../../../../common/edit-resume-tabs.const';
import { AddressDetailsComponent } from '../address/address-details.component';
import { PersonalInformationComponent } from '../personal-sub/personal-information/personal-information.component';
import { DisabilityInfoComponent } from '../Disability/disability-info/disability-info.component';
@Component({
  selector: 'app-personal-info',
  imports: [
    PersonalInformationComponent,
    AddressDetailsComponent,
    CareerApplicationInfoComponent,
    PreferredAreasComponent,
    OtherRelevantInfoComponent,
    DisabilityInfoComponent
  ],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.scss'
})
export class PersonalInfoComponent implements OnInit, OnChanges {

  subTabDetails = input<TabsElementModel>({} as TabsElementModel);

  ngOnInit(): void {}

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

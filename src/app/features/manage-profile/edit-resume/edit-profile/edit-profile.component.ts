import { Component, signal } from '@angular/core';
import { EditProfileTabsComponent } from '../edit-profile-tabs/edit-profile-tabs.component';
import { PersonalInfoComponent } from '../personal/personal-info/personal-info.component';
import { EducationTrainingComponent } from '../academic/education-training/education-training.component';
import { EmploymentComponent } from '../employment/employment/employment.component';
import { OtherInfoComponent } from '../other information/other-info/other-info.component';
import { AccomplishmentInfoComponent } from '../accomplishment/accomplishment-info/accomplishment-info.component';
import { MainTabs, TabEmitterModel, TabsElementModel } from '../../../common/edit-resume-tabs.const';

@Component({
  selector: 'app-edit-profile',
  imports: [
    EditProfileTabsComponent,
    PersonalInfoComponent,
    EducationTrainingComponent,
    EmploymentComponent,
    OtherInfoComponent,
    AccomplishmentInfoComponent,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {

  mainTabGetter = signal('');
  subTab = signal({} as TabsElementModel);
  mainTabs = MainTabs;

  getSubTab(event: TabEmitterModel) {
    this.mainTabGetter.set(event.mainTab);
    this.subTab.set(event.subTab);
    console.log('emit Getter',event)
  }
}

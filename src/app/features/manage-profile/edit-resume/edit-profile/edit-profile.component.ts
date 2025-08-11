import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { EditProfileTabsComponent } from '../edit-profile-tabs/edit-profile-tabs.component';
import { PersonalInfoComponent } from '../personal/personal-info/personal-info.component';
import { EducationTrainingComponent } from '../academic/education-training/education-training.component';
import { EmploymentComponent } from '../employment/employment/employment.component';
import { OtherInfoComponent } from '../other information/other-info/other-info.component';
import { AccomplishmentInfoComponent } from '../accomplishment/accomplishment-info/accomplishment-info.component';
import { MainTabs, TabEmitterModel, TabsElementModel } from '../../../common/edit-resume-tabs.const';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';

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
export class EditProfileComponent implements OnInit {
  
  private router = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  
  mainTabGetter = signal('');
  subTab = signal({} as TabsElementModel);
  mainTabs = MainTabs;
  mainTabParam = signal('');
  subTabParam = signal('');
  
  ngOnInit(): void {
    this.router.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(params => {
          // console.log(params)
          if(params['tab'] && (params['tab'] as string).length) {
            this.mainTabParam.set(params['tab'] as string);
          }
          if(params['from'] && (params['from'] as string).length) {
            this.subTabParam.set(params['from'] as string);
          }
        })
      )
      .subscribe()
  }

  getSubTab(event: TabEmitterModel) {
    this.mainTabGetter.set(event.mainTab);
    this.subTab.set(event.subTab);
  }
}

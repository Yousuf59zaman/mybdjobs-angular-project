import { AfterViewInit, Component, computed, EventEmitter, input, OnInit, Output, signal } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { AccomplishmentSubTabs, EducationSubTabs, EmploymentSubTabs, MainTabs, OtherInfoSubTabs, PersonalInfoSubtabs, TabEmitterModel, TabsElementModel} from '../../../common/edit-resume-tabs.const';
import { ViewResumeComponent } from "../../view-profile/view_resume/view-resume/view-resume.component";
import { DownloadResumeComponent } from "../../downloadResume/download-resume/download-resume.component";
import { reinitializePreline } from '../../../../shared/utils/reinitializePreline';

@Component({
  selector: 'app-edit-profile-tabs',
  imports: [
    CommonModule,
    NgClass,
    DatePipe,
    ViewResumeComponent,
    DownloadResumeComponent
  ],
  templateUrl: './edit-profile-tabs.component.html',
  styleUrl: './edit-profile-tabs.component.scss'
})
export class EditProfileTabsComponent implements OnInit, AfterViewInit {
  mainTabs = MainTabs;
  activeMainTab = signal(this.mainTabs[0]);

  mainTabIdFromDashboard = input('');
  subTabIdFromDashboard = input('');

  subTabs = computed(
    () => this.getSubTabs(this.activeMainTab().id)
  );
  activeSubtab = signal(this.subTabs()[0]);
  lastUpdateDate = signal(new Date().toLocaleDateString());
  profileMatchingScore = signal(100);

  isResumeDrawerOpen = false;
  isDownloadResumeDrawerOpen = false;
  @Output() subTabEmitter = new EventEmitter<TabEmitterModel>();

  ngOnInit(): void {
    if(this.mainTabIdFromDashboard().length && this.subTabIdFromDashboard().length) {
      this.activeMainTab.set(this.mainTabs.find(val => val.paramMainId === this.mainTabIdFromDashboard()) as TabsElementModel);
      this.activeSubtab.set(this.subTabs().find(val => val.paramSubId === this.subTabIdFromDashboard()) as TabsElementModel)
    }
    this.subTabEmitter.emit({
      mainTab: this.activeMainTab().value,
      subTab: this.activeSubtab()
    });
  }

  ngAfterViewInit(): void {
    reinitializePreline();
  }

  setMainTab(tab: TabsElementModel) {

    this.activeMainTab.set(tab);
    this.activeSubtab.set(this.subTabs()[0]);
    this.subTabEmitter.emit({
      mainTab: this.activeMainTab().value,
      subTab: this.activeSubtab()
    });

    if(this.activeMainTab().id !== tab.id) {
      this.activeMainTab.set(tab);
      this.activeSubtab.set(this.subTabs()[0]);
      this.subTabEmitter.emit({
        mainTab: this.activeMainTab().value,
        subTab: this.activeSubtab()
      } as TabEmitterModel);
    }
  }

  getSubTabs(id: number) {
    switch(id) {
      case 2:
        return EducationSubTabs;
      case 3:
        return EmploymentSubTabs;
      case 4:
        return OtherInfoSubTabs;
      case 5:
        return AccomplishmentSubTabs;
      default:
        return PersonalInfoSubtabs;
    }
  }

  setSubtab(subtab: TabsElementModel) {
    if(this.activeSubtab().id !== subtab.id ) {
      this.activeSubtab.set(subtab);
      this.subTabEmitter.emit({
        mainTab: this.activeMainTab().value,
        subTab: this.activeSubtab()
      } as TabEmitterModel);
    }
  }

  isMainTabActive(tabId: string): boolean {
    return this.activeMainTab().value === tabId;
  }

  isSubtabActive(subtabId: string): boolean {
    return this.activeSubtab().value === subtabId;
  }

  showResumeDrawer() {
    this.isResumeDrawerOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeResumeDrawer() {
    this.isResumeDrawerOpen = false;
    document.body.style.overflow = '';
  }

  onClickDownloadResume() {
    this.showDownloadResumeDrawer();
  }

  showDownloadResumeDrawer() {
    this.isDownloadResumeDrawerOpen = true;  // Changed from isResumeDrawerOpen
    document.body.style.overflow = 'hidden';
  }

  closeDownloadResumeDrawer() {
    this.isDownloadResumeDrawerOpen = false;

    document.body.style.overflow = '';
  }

  // Remove these duplicate/unused methods if not needed
  // onViewResume() {
  //   this.showResumeDrawer();
  // }
  //
  // viewDownloadResume() {
  //   this.showDowloadResumeDrawer();
  // }
  //
  // showDowloadResumeDrawer() {
  //   this.isResumeDrawerOpen = true;
  //   document.body.style.overflow = 'hidden';
  // }
}

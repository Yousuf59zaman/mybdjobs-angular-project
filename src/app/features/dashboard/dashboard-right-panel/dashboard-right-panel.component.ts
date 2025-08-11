import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RingChartComponent } from "../../../shared/components/ring-chart/ring-chart.component";
import { RouterLink } from '@angular/router';
import { ProfileSelection } from '../utils/dashboard.const';
import { CookieService } from '../../../core/services/cookie/cookie.service';
import { DashboardService } from '../services/dashboard.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomizedCVResponse, DashboardRightPanelData, ProfileResumeResponse, VideoQuestionResponse, VideoResumeResponse } from '../models/dashboard.models';
import { IsNotEmptyObject } from '../../../shared/utils/functions';
import { finalize } from 'rxjs';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-dashboard-right-panel',
  imports: [
    NgClass,
    NgStyle,
    RingChartComponent,
    RouterLink,
    DatePipe,
    TranslocoModule,
    RouterLink
  ],
  providers:[provideTranslocoScope('dashboard')],
  templateUrl: './dashboard-right-panel.component.html',
  styleUrl: './dashboard-right-panel.component.scss'
})
export class DashboardRightPanelComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private dashboardServide = inject(DashboardService);
  private cookieService = inject(CookieService);
  private translocoService = inject(TranslocoService);

  UserGuid: string | null = null;
  isPro = signal(true);
  profileData = signal({} as ProfileResumeResponse);
  videoCvData = signal([] as VideoResumeResponse[]);
  customizedCvData = signal({} as CustomizedCVResponse);
  isVideoCvAvailable = signal(false);
  isCustomizedCvAvailable = signal(false);
  buttons = ['dashboard.bdjobsProfile', 'dashboard.videoCV', 'dashboard.customizedCV'];
  selectedBtn = 'dashboard.bdjobsProfile';
  profileProgression = signal(0);
  videoCvProgression = signal(0);
  profileSection = ProfileSelection;
  isLoading = signal<'initial' | 'loading' | 'done'>('initial');
  activeLanguage = signal('en')
  languageChange = this.translocoService.langChanges$
    .subscribe(
      (val) => this.activeLanguage.set(val)
    );

  ngOnInit(): void {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId');
    this.UserGuid = rawGuid ? decodeURIComponent(rawGuid) : null;

    this.getDashboardRightPanelInfo();
  }

  getDashboardRightPanelInfo() {
    const userGuid = this.UserGuid as string;
    // decodeURIComponent('Zig6IFSxIFLyIRcuBb00ZlL9MTL6IELyP7OiPTPjBRc3PRGxBFPtBFVRIGL3UWg=')

    this.isLoading.set('loading');
    this.dashboardServide.getDashBoardProgressInfo(userGuid)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // filter((res)=> res.event.eventId !== 0)
        finalize(() => this.isLoading.set('done')),
      )
      .subscribe({
        next: (res)=> {
          const response = res.event.eventData.find((data) => data.key === 'message')?.value as DashboardRightPanelData;
          if(IsNotEmptyObject(response)) {
            this.profileData.set(response.resumeResponse);
            this.videoCvData.set(response.videoResumeResponse.filter(data => data.questionId <= 3));
            this.customizedCvData.set(response.fileResponse);
            this.videoCvProgression.update(() => Math.round(((this.videoCvData().filter(data => data.aId).length)/3)*100))
            this.setProfileDetails();
            this.profileProgression.update(() => Math.round(((this.profileSection.filter(data => data.isCompleted).length)/8)*100));
            this.isVideoCvAvailable.update(
              () => response.videoQuestionResponse !== null && response.videoQuestionResponse.videoResumeTotalAnswerQuestion > 0
            );
            this.isCustomizedCvAvailable.update(
              () => response.fileResponse !== null && response.fileResponse.path_doc.length !== 0
            )
          }
        },
        error: ()=> {}
      })
      
  }

  setProfileDetails() {
    this.profileSection = this.profileSection.map(
      data => {
        return {
          ...data,
          isCompleted: this.isCompletedSection(data.id)
        }
      }
    )
  }

  isCompletedSection(id: string) {
    switch(id) {
      case '2':
        return this.profileData().professionalQualification !== 0
      case '3':
        return this.profileData().academicQualification !== 0
      case '4':
        return this.profileData().experience !== 0
      case '5':
        return this.profileData().refference !== 0
      case '6':
        return this.profileData().training !== 0
      case '7':
        return this.profileData().specialization !== 0
      case '8':
        return this.profileData().photoUploaded !== 0
      default:
        return this.profileData().isCVposted !== 0
    }
  }

  onClcikViewResume() {}
}

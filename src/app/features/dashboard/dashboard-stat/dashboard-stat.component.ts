import { Component, computed, DestroyRef, inject, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { HalfDonutChartComponent } from "../../../shared/components/half-donut-chart/half-donut-chart.component";
import { NgClass, NgStyle } from '@angular/common';
import { SelectboxComponent } from "../../../shared/components/selectbox/selectbox.component";
import { FormControl } from '@angular/forms';
import { LineChartComponent } from "../../../shared/components/line-chart/line-chart.component";
import { DonutChartComponent } from "../../../shared/components/donut-chart/donut-chart.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardService } from '../services/dashboard.service';
import { DashboardInfoResponse, DashboardStatsResponse, DashboardInfoPayload, DashboardStatsPayload, ProStatInfo } from '../models/dashboard.models';
import { SelectItem } from '../../../shared/models/models';
import { CookieService } from '../../../core/services/cookie/cookie.service';
import { CircularLoaderService } from '../../../core/services/circularLoader/circular-loader.service';
import { finalize } from 'rxjs';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';

export enum TabBtns {
  General = 'dashboard.generalStat',
  Pro = 'dashboard.proStat'
}

@Component({
  selector: 'app-dashboard-stat',
  imports: [
    HalfDonutChartComponent,
    NgStyle,
    SelectboxComponent,
    LineChartComponent,
    DonutChartComponent,
    NgClass,
    TranslocoModule
  ],
  providers:[provideTranslocoScope('dashboard')],
  templateUrl: './dashboard-stat.component.html',
  styleUrl: './dashboard-stat.component.scss'
})
export class DashboardStatComponent implements OnInit, OnChanges {

  private destroyRef = inject(DestroyRef);
  private dashboardService = inject(DashboardService);
  private cookieService = inject(CookieService);
  private loadrService = inject(CircularLoaderService);
  private translocoService = inject(TranslocoService);

  UserGuid: string | null = null;
  isBdjobsPro = signal(false);
  stats = [TabBtns.General, TabBtns.Pro]
  selectedBtn = TabBtns.General
  borderColor = '#1D9DDA'
  activeLanguage = signal('en');
  donutChartHeader = ['dashboard.profileView', 'dashboard.emailCV', 'dashboard.downloadCV']
  selectedHeader = 'dashboard.profileView';

  profileView = signal([
    {
      id: '1',
      boxColor: '#0E6596',
      title: 'dashboard.bdjobsProfile',
      count: 0,
      boxShadow: '#EDF7FC',
    },
    {
      id: '2',
      boxColor: '#1D9DDA',
      title: 'dashboard.videoCV',
      count: 0,
      boxShadow: '#EDF7FC',
    },
    {
      id: '3',
      boxColor: '#F79009',
      title: 'dashboard.customizedCV',
      count: 0,
      boxShadow: '#FCF6ED',
    }
  ])

  emailCv = signal([
    {
      id: '1',
      boxColor: '#0E6596',
      title: 'dashboard.bdjobsCV',
      count: 0,
      boxShadow: '#EDF7FC',
    },
    {
      id: '2',
      boxColor: '#F79009',
      title: 'dashboard.personalizedCV',
      count: 0,
      boxShadow: '#FCF6ED',
    },
  ])

  downloadCv = signal([
    {
      id: '1',
      boxColor: '#0E6596',
      title: 'dashboard.bdjobsCV',
      count: 0,
      boxShadow: '#EDF7FC',
    },
    {
      id: '2',
      boxColor: '#F79009',
      title: 'dashboard.personalizedCV',
      count: 0,
      boxShadow: '#FCF6ED',
    },
  ])

  invitationView = signal([
    {
      id: '1',
      boxColor: '#0E6596',
      title: 'dashboard.onlineTest',
      count: 0,
      boxShadow: '#EDF7FC',
    },
    {
      id: '2',
      boxColor: '#079455    ',
      title: 'dashboard.videoInterview',
      count: 0,
      boxShadow: '#EDFCF6',
    },
    {
      id: '3',
      boxColor: '#1D9DDA',
      title: 'dashboard.generalInterview',
      count: 0,
      boxShadow: '#EDF7FC',
    },
    {
      id: '4',
      boxColor: '#F79009',
      title: 'dashboard.personalityTest',
      count: 0,
      boxShadow: '#FCF6ED',
    }
  ])

  filterTimeOptions = signal([
    {
      selectId: '1',
      label: 'Last 7 Days',
      value: '7'
    },
    {
      selectId: '2',
      label: 'Last 14 Days',
      value: '14'
    },

    {
      selectId: '3',
      label: 'Last 28 Days',
      value: '28'
    },
    {
      selectId: '4',
      label: 'Last Year',
      value: '365'
    }
  ] as SelectItem[])
  selectedFilteredTime = signal(this.filterTimeOptions()[0] as SelectItem);
  profileLabel = computed(
    () => this.profileView().map(item => this.translocoService.translate(item.title))
  )
  emailLabel = computed(
    () => this.emailCv().map(item => this.translocoService.translate(item.title))
  )
  downloadLabel = computed(
    () => this.downloadCv().map(item => this.translocoService.translate(item.title))
  )
  invitationLabel = computed(
    () => this.invitationView().map(item => this.translocoService.translate(item.title))
  )

  data = []

  statsCards = signal([
    {
      id: '1',
      imageUrl: 'images/fav_search.svg',
      title: "dashboard.favouriteSearch",
      count: 0,
      // upgrade: 10.2,
      borderColor: '#1D9DDA',
      bgColor: '#F5FAFC'
    },
    {
      id: '2',
      imageUrl: 'images/saved-jobs.svg',
      title: "dashboard.savedJobs",
      count: 0,
      // upgrade: 10.2,
      borderColor: '#D8CB55',
      bgColor: '#FCFBF2'
    },
    {
      id: '3',
      imageUrl: 'images/follow-emp.svg',
      title: "dashboard.followingEmployer",
      count: 0,
      // upgrade: -10.2,
      borderColor: '#C63C92',
      bgColor: '#F2FCFC'
    },
  ])

  proStatsCards = [
    {
      id: '1',
      title: 'dashboard.seeWhoViewedMyProfile',
      count: 0,
      bgColor: '#F5FAFC',
      color: '#1D9DDA',
    },

    {
      id: '2',
      title: 'dashboard.earlyAccessJobs',
      count: 0,
      bgColor: '#FCFBF2',
      color: '#D8CB55',
    },

    {
      id: '3',
      title: 'dashboard.seeWhoShortlistedMe',
      count: 0,
      bgColor: '#F2FCFC',
      color: '#C63C92',
    },

  ]

  otherFeatures = [
    {
      id: '1',
      title: 'dashboard.seeMatchingPercentage',
      iconImage: 'match-percent'
    },

    {
      id: '2',
      title: 'dashboard.fullCareerCounsellingAccess',
      iconImage: 'career-counsel'
    },

    {
      id: '3',
      title: 'dashboard.fullLengthCV',
      iconImage: 'video-cv'
    },

    {
      id: '4',
      title: 'dashboard.seeJobDetailsAfterDeadline',
      iconImage: 'jobdetails'
    },

    {
      id: '5',
      title: 'dashboard.seeApplicationInsight',
      iconImage: 'app-insight'
    },

    {
      id: '6',
      title: 'dashboard.trackEmployerActivity',
      iconImage: 'track-employer'
    },
  ]

  statsData = signal({} as DashboardInfoResponse);
  graphData = signal([] as DashboardStatsResponse[]);
  proData = signal<ProStatInfo[]>([]);
  filterTimeControl = new FormControl(this.selectedFilteredTime().value);

  profileViewDonutData = computed(
    () => this.profileView().filter(item => item.count).map(item => item.count)
  )
  emailCvDonutData = computed(
    () => this.emailCv().filter(item => item.count).map(item => item.count)
  )
  downloadCvDonutData = computed(
    () => this.downloadCv().filter(item => item.count).map(item => item.count)
  )
  invitaionDonutData = computed(
    () => this.invitationView().filter(item => item.count).map(item => item.count)
  )
  graphLabelData = computed(
    () => this.graphData().map(item => item.dateOfApplied)
  )
  graphValueData = computed(
    () => this.graphData().map(item => item.numberOfJobApplied)
  )

  timeChange = this.filterTimeControl.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(
      (val) => {
        if(val !== this.selectedFilteredTime().value) {
          this.selectedFilteredTime.set(
            this.filterTimeOptions().find((item) => item.value === val) as SelectItem
          );
          this.loadrService.setLoading(true);
          this.getGeneralStatInfo();
          this.getGeneralStatsGraphInfo();
        }
      }
    );

  languageChange = this.translocoService.langChanges$
    .subscribe(
      (val) => {
        this.activeLanguage.set(val);
      }
    );

  ngOnInit(): void {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId');
    this.UserGuid = rawGuid ? decodeURIComponent(rawGuid) : null;
    this.isBdjobsPro.set((this.cookieService.getCookie('IsBdjobsPro') as string) === 'true' );

    if(this.selectedBtn === TabBtns.General) {
      this.getGeneralStatInfo();
      this.getGeneralStatsGraphInfo();
    } else if(this.isBdjobsPro()) {
      this.getProStatInfo();
    }
  }

  ngOnChanges(changes: SimpleChanges): void { }

  onClickStatChangeBtn(stat: string) {
    if(this.selectedBtn !== stat) {
      this.loadrService.setLoading(true)
      switch(stat) {
        case TabBtns.Pro:
          this.selectedBtn = stat;
          if(this.isBdjobsPro()) {
            this.getProStatInfo();
          } else {
            this.loadrService.setLoading(false);
          }
          break;
        default:
          this.selectedBtn = TabBtns.General;
          this.getGeneralStatInfo();
          break;
      }
    }
  }

  getGeneralStatInfo() {
    const payload = {
      userGuid: this.UserGuid as string,
      // decodeURIComponent('Zig6IFSxIFLyIRcuBb00ZlL9MTL6IELyP7OiPTPjBRc3PRGxBFPtBFVRIGL3UWg=')
      numberOfDays: +(this.selectedFilteredTime().value as string)
    } as DashboardInfoPayload;

    this.dashboardService.getGeneralStatInfo(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // filter((res)=> res.event.eventId !== 0)
        finalize(() => this.loadrService.setLoading(false)),
      )
      .subscribe({
        next: (res)=> {
          if(res.event.eventData.length) {
            this.statsData.update(
              () => res.event.eventData.find((data) => data.key === 'message')?.value as DashboardInfoResponse
            );
            this.setStatsCards();
            this.setBottomChartsValue();
          }
        },
        error: ()=> {}
      })
  }

  getGeneralStatsGraphInfo() {
    const payload = {
      userGuid: this.UserGuid as string,
      // decodeURIComponent('Zig6IFSxIFLyIRcuBb00ZlL9MTL6IELyP7OiPTPjBRc3PRGxBFPtBFVRIGL3UWg=')
      dateGroupingOption: +(this.selectedFilteredTime().selectId as string)
    } as DashboardStatsPayload;

    this.dashboardService.getGeneralStatGraphInfo(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // filter((res)=> res.event.eventId !== 0)
        finalize(() => this.loadrService.setLoading(false)),
      )
      .subscribe({
        next: (res)=> {
          if(res.event.eventData.length) {
            this.graphData.update(
              () => res.event.eventData.find((data) => data.key === 'message')?.value as DashboardStatsResponse[]
            );
          }
        },
        error: ()=> {}
      })
  }

  setStatsCards(){
    this.statsCards.update(
      prevData => prevData.map(
        card => card.title === 'Favorite Search'
          ? {
            ...card,
            count: this.statsData().totalFavouriteSearch,
          }
          : card.title === 'Saved Jobs'
            ? {
              ...card,
              count: this.statsData().totalSavedJobs,
            }
            : {
              ...card,
              count: this.statsData().totalFollowingEmployers,
            }
      )
    )
  }

  setBottomChartsValue() {
    this.profileView.update(
      prevData => prevData.map(
        card => card.title === 'Bdjobs Profile'
          ? {
            ...card,
            count: this.statsData().totalBdjobsProfileView,
          }
          : card.title === 'Video CV'
            ? {
              ...card,
              count: this.statsData().totalVideoCvViewed,
            }
            : {
              ...card,
              count: this.statsData().totalCustomizedCvViewed,
            }
      )
    )
    this.emailCv.update(
      prevData => prevData.map(
        card => card.title === 'Bdjobs CV'
          ? {
            ...card,
            count: this.statsData().emailedBdjobsResume,
          }
          : {
            ...card,
            count: this.statsData().emailedPersonalResume,
          }
      )
    )
    this.downloadCv.update(
      prevData => prevData.map(
        card => card.title === 'Bdjobs CV'
          ? {
            ...card,
            count: this.statsData().downloadedBdjobsResume,
          }
          : {
            ...card,
            count: this.statsData().downloadedPersonalResume,
          }
      )
    )
    this.invitationView.update(
      prevData => prevData.map(
        card => {
          switch(card.title) {
            case 'Online Test':
              return {
                ...card,
                count: this.statsData().totalOnlineTest
              }
            case 'Video Interview':
              return {
                ...card,
                count: this.statsData().totalVideoInterview
              }
            case 'General Interview':
              return {
                ...card,
                count: this.statsData().totalGeneralInterview
              }
            default:
              return {
                ...card,
                count: this.statsData().totalPersonalityTest
              }
          }
        }
      )
    )
  }

  getProStatInfo() {
    const userGuid = this.UserGuid as string;
    // decodeURIComponent('Zig6IFSxIFLyIRcuBb00ZlL9MTL6IELyP7OiPTPjBRc3PRGxBFPtBFVRIGL3UWg=')
    
    this.dashboardService.getDashboardProStatInfo(userGuid)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // filter((res)=> res.event.eventId !== 0)
        finalize(() => this.loadrService.setLoading(false)),
      )
      .subscribe({
        next: (res)=> {
          if(res.event.eventData.length) {
            this.proData.set(
              res.event.eventData.find((data) => data.key === 'message')?.value as ProStatInfo[]
            )
            this.setProCardsData();
          }
        },
        error: ()=> {}
      })
  }

  getApplicationProStat(packageName: string) {
    const packageData = this.proData().find(data => data.featureName.includes(packageName)) as ProStatInfo;

    return packageData;
  }

  setProCardsData() {
    this.proStatsCards = this.proStatsCards.map(
      card => {
        return {
          ...card,
          count: card.id === '1'
            ? (this.proData().find(data => data.featureName.includes('Viewed My Profile')) as ProStatInfo)?.totalUsed || 0
            : card.id === '2'
              ? (this.proData().find(data => data.featureName.includes('Early Job')) as ProStatInfo)?.earlyAccessJobs || 0
              : (this.proData().find(data => data.featureName.includes('who Shortlisted Me')) as ProStatInfo)?.totalUsed || 0
        }
      }
    )
  }

}

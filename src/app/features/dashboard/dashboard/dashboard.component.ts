import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProgressBarComponent } from "../../../shared/components/progress-bar/progress-bar.component";
import { DashboardRightPanelComponent } from "../dashboard-right-panel/dashboard-right-panel.component";
import { InvitationBoardComponent } from "../invitation-board/invitation-board.component";
import { DashboardStatComponent } from "../dashboard-stat/dashboard-stat.component";
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../services/dashboard.service';
import { CookieService } from '../../../core/services/cookie/cookie.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IsNotEmptyObject } from '../../../shared/utils/functions';
import { DashboardPersonalInfoResponse, InvitationResponse } from '../models/dashboard.models';
import { DatePipe, NgClass } from '@angular/common';
import { CircularLoaderService } from '../../../core/services/circularLoader/circular-loader.service';
import { finalize } from 'rxjs';
import { DashboardSkeletonComponent } from "../dashboard-skeleton/dashboard-skeleton.component";
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { DashboardModalComponent } from "../dashboard-modal/dashboard-modal.component";

@Component({
  selector: 'app-dashboard',
  imports: [
    ProgressBarComponent,
    DashboardRightPanelComponent,
    InvitationBoardComponent,
    DashboardStatComponent,
    DatePipe,
    DashboardSkeletonComponent,
    TranslocoModule,
    NgClass,
    DashboardModalComponent
],
  providers:[provideTranslocoScope('dashboard')],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private dashboardServide = inject(DashboardService);
  private toastr = inject(ToastrService);
  private cookieService = inject(CookieService);
  private loadrService = inject(CircularLoaderService);

  UserGuid: string | null = null;
  isPro = signal(true);
  profileName = signal('Applicant');
  personalData = signal({} as DashboardPersonalInfoResponse);
  invitationCounts = signal({} as InvitationResponse);
  isLoading = signal<'initial' | 'loading' | 'done'>('initial');
  premiumProgress = signal(0);
  premiumProgressMax = signal(0);
  packageType = signal('');
  isModalOpen = signal(false);

  ngOnInit(): void {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId');
    this.UserGuid = rawGuid ? decodeURIComponent(rawGuid) : null;

    this.getPersonalDashboardInfo();
  }

  getPersonalDashboardInfo() {
    const userGuid = this.UserGuid as string;
    // decodeURIComponent('Zig6IFSxIFLyIRcuBb00ZlL9MTL6IELyP7OiPTPjBRc3PRGxBFPtBFVRIGL3UWg=')

    this.isLoading.set('loading');
    this.dashboardServide.getPersonalDashboardInfo(userGuid)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // filter((res)=> res.event.eventId !== 0)
        finalize(() => this.isLoading.set('done')),
      )
      .subscribe({
        next: (res)=> {
          const response = res.event.eventData.find((data) => data.key === 'message')?.value as DashboardPersonalInfoResponse;
          if(IsNotEmptyObject(response)) {
            this.personalData.set(response);
            this.personalData().planAndPointsResponse.packageEndDate = this.getPackageEndDate();
            this.invitationCounts.set(this.personalData().interViewInvitationResponse);
          }
        },
        error: ()=> {}
      })
  }

  getPackageEndDate(): string {
    const packageEndDate = new Date(this.personalData().planAndPointsResponse.packageStartDate as string);
    packageEndDate.setMonth(packageEndDate.getMonth()+(this.personalData().planAndPointsResponse.packageDuration as number));
    const now = new Date();
    const start = new Date(this.personalData().planAndPointsResponse.packageStartDate as string);
    this.premiumProgress.set((now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()))
    this.premiumProgressMax.set(this.personalData().planAndPointsResponse.packageDuration as number);
    return packageEndDate.toString();
  }

  onClickChangePlan(type: string) {
    type.length === 0
      ? window.location.href = 'https://mybdjobs.bdjobs.com/bdjobs-pro/bdjobs-pro-package-pricing'
      : this.packageType.set(type);
    this.isModalOpen.set(true);
  }
}

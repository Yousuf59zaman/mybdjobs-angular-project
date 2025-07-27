import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { CookieService } from '../../../../core/services/cookie/cookie.service';
import { ProfilePreferenceService } from '../service/profile-preference.service';
import { PrivacyStatus } from '../model/profilepreferences';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-profile-preference',
  imports: [ReactiveFormsModule, FormsModule, TranslocoModule],
  providers: [provideTranslocoScope('profilePreference')],
  templateUrl: './profile-preference.component.html',
  styleUrl: './profile-preference.component.scss'
})
export class ProfilePreferenceComponent implements OnInit {

  isProfileVisibilityExpanded = false;
  currentVisibility: number = 1;

  isAvailabilityExpanded = false;
  currentAvailability: 'yes' | 'no' = 'yes';

  isVideoResumeExpanded = false;
  videoResumeVisibility: 'Public' | 'Private' = 'Public';

  @Input() selectedVisibility: number = 1;
  @Output() visibilityChange = new EventEmitter<number>();

  searchQuery: string = '';
  selectedEmployers: any[] = [];
  searchResults: any[] = [];
  
  constructor(
    private profilePreferenceService: ProfilePreferenceService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.loadProfilePreferences();
  }

  loadProfilePreferences(): void {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || '';
    const userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
    if (!userGuidId) {
      return;
    }
    const query: string = userGuidId;
    this.profilePreferenceService.getProfilePreferences(query).subscribe({
      next: (response) => {
        const eventData = response?.event?.eventData;
        if (eventData && Array.isArray(eventData)) {
          const messageObj = eventData.find((item: any) => item.key === 'message');
          if (messageObj && messageObj.value) {
            this.setProfilePreferences(messageObj.value);
          }
        }
      }
    });
  }

  private setProfilePreferences(preferences: PrivacyStatus): void {
    this.currentVisibility = preferences.profileVisibilityStatus;
    this.selectedVisibility = this.currentVisibility;
    this.currentAvailability = preferences.availabilityStatus ? 'yes' : 'no';
    this.videoResumeVisibility = preferences.isShowVideoResume ? 'Public' : 'Private';
    this.selectedEmployers = preferences.blockedCompanyIdsInfos || [];
  }

  toggleProfileVisibility(): void {
    this.isProfileVisibilityExpanded = !this.isProfileVisibilityExpanded;
  }
  onVisibilityChange(visibility: number): void {
    this.currentVisibility = visibility;
  }
  saveProfileVisibility(): void {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || '';
    const userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
    let corporateIds = '';
    if (this.selectedVisibility === 3 && this.selectedEmployers.length > 0) {
      corporateIds = ',' + this.selectedEmployers.map(e => e.id).join(',') + ',';
    }
    if (!userGuidId) {
      return;
    }
    this.profilePreferenceService
      .putProfileVisibilityStatus(userGuidId, corporateIds, this.selectedVisibility)
      .subscribe({
        next: () => {
          this.isProfileVisibilityExpanded = false;
          this.loadProfilePreferences();
        },
        error: () => {
        }
      });
  }
  toggleAvailability(): void {
    this.isAvailabilityExpanded = !this.isAvailabilityExpanded;
  }

  onAvailabilityChange(availability: 'yes' | 'no'): void {
    this.currentAvailability = availability;
  }
  saveAvailability(): void {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || '';
    const userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
    if (!userGuidId) {
      return;
    }
    const isAvailable = this.currentAvailability === 'yes';
    this.profilePreferenceService.putAvailabilityStatus(userGuidId, isAvailable).subscribe({
      next: () => {
        this.isAvailabilityExpanded = false;
      }
    });
  }
  toggleVideoResume(): void {
    this.isVideoResumeExpanded = !this.isVideoResumeExpanded;
  }
  onVideoResumeChange(visibility: 'Public' | 'Private'): void {
    this.videoResumeVisibility = visibility;
  }

  saveVideoResume(): void {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || '';
    const userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
    if (!userGuidId) {
      return;
    }
    const isAvailable = this.videoResumeVisibility === 'Public';
    this.profilePreferenceService.putVideoResumeStatus(userGuidId, isAvailable).subscribe({
      next: () => {
        this.isVideoResumeExpanded = false;
      }
    });
  }

  selectLimited(): void {
    this.selectedVisibility = 2;
    this.visibilityChange.emit(2);
  }

  onLimitedVisibilityChange(value: number): void {
    this.visibilityChange.emit(value);
    if (value !== 3) {
      this.selectedEmployers = []; 
    }
  }

  isSearching = false;
  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;
    this.profilePreferenceService.getCompanySuggestions(this.searchQuery)
      .pipe(finalize(() => this.isSearching = false))
      .subscribe({
        next: (response) => {
          const messageArray = response?.event?.eventData?.find(
            (item: any) => item.key === 'message'
          )?.value || [];

          const companiesData = messageArray
            .flatMap((item: any) => item.companyProfileResponse || [])
            .map((company: any) => ({
              id: company.cP_ID,
              name: company.name
            }));

          this.searchResults = companiesData.filter((company: any) =>
            !this.selectedEmployers.some((selected: any) => selected.id === company.id)
          );
        },
        error: (err) => {
          this.searchResults = [];
        }
      });
  }
  selectEmployer(employer: any): void {
    this.selectedEmployers = [...this.selectedEmployers, employer];
    this.searchQuery = '';
    this.searchResults = [];
  }

  removeEmployer(id: string): void {
    this.selectedEmployers = this.selectedEmployers.filter(employer => employer.id !== id);
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AddressShort, GetShortCvViewInfo, GetShortCvViewInfoRequest, PersonalInfoShortResponse, EducationShort, ExperienceShort, ReferenceShort, SkillShort, TrainingShort } from '../interface/shortCVInterface';
import { ShortCVService } from '../service/short-cv.service';
import { CookieService } from '../../../../core/services/cookie/cookie.service';


@Component({
  selector: 'app-short-cv',
  templateUrl: './short-cv.component.html',
  styleUrls: ['./short-cv.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  providers: [DatePipe],
  standalone: true,

})
export class ShortCvComponent implements OnInit {

  isLoading = false;
  errorMessage = '';
  cvData: GetShortCvViewInfo = {
    personalInfoShortResponse: {
      fullName: '',
      fatherName: '',
      motherName: '',
      dateOfBirth: '',
      gender: '',
      height: '',
      weight: '',
      currentLocation: '',
      permanentAddress: '',
      homePhone: '',
      mobileNumber: '',
      officePhone: '',
      primaryEmail: '',
      secondaryEmail: '',
      nationalID: '',
      nationality: '',
      passportNumber: '',
      passportIssueDate: '',
      profileURL: '',
      photoName: '',
      folderName: '',
      birthPlace: '',
      totalExperience: 0,
    },
    experienceShort: [],
    skillShort: [],
    trainingShort: [],
    educationShort: [],
    referenceShort: [],
    addressShort: []
  };

  phones: { type: string; number: string }[] = [];
  emails: { type: string; email: string }[] = [];
  skills: SkillShort[] = [];
  address: AddressShort[] = [];
  trainings: TrainingShort[] = [];
  educations: EducationShort[] = [];
  references: ReferenceShort[] = [];
  experiences: ExperienceShort[] = [];

  constructor(
    private shortCvService: ShortCVService, private datePipe: DatePipe, private cookieService: CookieService
  ) { }

  // In your component.ts
  get currentAddress(): string {
    const address = this.cvData.addressShort?.find(a => a.addressType === 1);
    return address?.displayLocation || '';
  }

  get permanentAddress(): string {
    const address = this.cvData.addressShort?.find(a => a.addressType === 2);
    return address?.displayLocation || '';
  }

  getFormattedBirthDate(): string {
    return this.datePipe.transform(this.cvData.personalInfoShortResponse.dateOfBirth, 'MMMM d, y') || '';
  }
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    // Handle invalid dates
    if (isNaN(date.getTime())) return '';

    const month = this.datePipe.transform(date, 'MMMM');
    const day = this.datePipe.transform(date, 'dd');
    const year = date.getFullYear();
    
    return `${day} ${month}, ${year}`;
  }
  ngOnInit(): void {
    this.loadCv();
  }

  loadCv(): void {
    const query: GetShortCvViewInfoRequest = {
      UserGuid: 'ZRDhZ7YxZEYyITPbBQ00PFPiMTDhBTUyPRmbPxdxYiObIFZ9BFPtBFVUIGL3Ung='
    };
    
      // const rawGuid = this.cookieService.getCookie('MybdjobsGId') || 'ZiZuPid0ZRLyZ7S3YQ00PRg7MRgwPELyBTYxPRLzZESuYTU0BFPtBFVUIGL3Ung%3D'; // for development only
     // this.userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
     // console.log('User GUID ID Photo Component:', this.userGuidId);

    this.isLoading = true;
    this.shortCvService.getShortCv(query).subscribe({
      next: (res) => {
        if (!res?.event?.eventData || res.event.eventData.length === 0) {
          console.error('Invalid API response structure', res);
          this.isLoading = false;
          return;
        }

        this.cvData = res.event.eventData[0].value;
        console.log("cv Data",this.cvData)
        this.address = this.cvData.addressShort
        this.skills = this.cvData.skillShort
        console.log("skills", this.skills)
        this.trainings = this.cvData.trainingShort;
        this.educations = this.cvData.educationShort;
        this.experiences = this.cvData.experienceShort;
        this.references = this.cvData.referenceShort || [];
        this.updateContactInfo();
        this.isLoading = false;
        console.log("Api Data", res)
      },
      error: (err) => {
        console.error('API Error:', err);
        this.errorMessage = 'Failed to load CV data';
        this.isLoading = false;
      }
    });
  }

  updateContactInfo(): void {
    this.phones = [];
    if (this.cvData.personalInfoShortResponse.mobileNumber) {
      this.phones.push({ type: 'Mobile', number: this.cvData.personalInfoShortResponse.mobileNumber });
    }
    if (this.cvData.personalInfoShortResponse.officePhone) {
      this.phones.push({ type: 'Office', number: this.cvData.personalInfoShortResponse.officePhone });
    }
    if (this.cvData.personalInfoShortResponse.homePhone) {
      this.phones.push({ type: 'Home', number: this.cvData.personalInfoShortResponse.homePhone });
    }

    this.emails = [];
    if (this.cvData.personalInfoShortResponse.primaryEmail) {
      this.emails.push({ type: 'Primary', email: this.cvData.personalInfoShortResponse.primaryEmail });
    }
    if (this.cvData.personalInfoShortResponse.secondaryEmail) {
      this.emails.push({ type: 'Secondary', email: this.cvData.personalInfoShortResponse.secondaryEmail });
    }
  }
}

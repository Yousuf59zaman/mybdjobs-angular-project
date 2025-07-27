import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import {
  GetDetailsCvViewInfoRequest,
  CvViewInfo,
  SkillResponse,
  AddressResponse,
  TrainingResponse,
  EducationResponse,
  ReferenceResponse,
  ExperienceResponse,
  LanguageResponse,
  QualificationResponse,
  BDJamCertificateResponse,
  DisabilityResponse} from '../interface/detailsCvInterface';
import { DetailsCVService } from '../service/details-cv.service';
import { CookieService } from '../../../../core/services/cookie/cookie.service';

@Component({
  selector: 'app-details-cv',
  templateUrl: './details-cv.component.html',
  styleUrls: ['./details-cv.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  providers: [DatePipe],
  standalone: true
})
export class DetailsCVComponent implements OnInit {
  cvData: CvViewInfo = {
    fullName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    photoName: '',
    folderName: '',
    totalExperience: 0,
    experience: [],
    skills: [],
    training: [],
    education: [],
    reference: [],
    address: [],
    languages: [],
    qualifications: [],
    bdJamCertificate: [],
    gender: '',
    homePhone: '',
    mobileNumber: '',
    officePhone: '',
    primaryEmail: '',
    secondaryEmail: '',
    nationalID: 0,
    nationality: '',
    passportNumber: '',
    passportIssueDate: '',
    profileURL: '',
    birthplace: '',
    heightInCm: 0,
    weightInKg: 0,
    maritalStatus: '',
    currentSalary: 0,
    expectedSalary: 0,
    religion: '',
    bloodGroup: '',
    specialQualifications: '',
    skillDescription: '',
    careerSummary: '',
    objective: '',
    preferences: '',
    extraCurricularActivities: '',

    primaryBadgeNumber: '',
    secondaryBadgeNumber: 0,
    militaryRank: '',
    serviceBranch: '',
    militaryTrade: '',
    militaryCourse: '',
    commissionDate: '',
    retirementDate: '',
    
    experienceUpdate: [],
    category: [],
    organization: [],
    preferredCountry: [],
    preferredDistrict: [],
    disability: [],
    accomplishment: []
  };

  isLoading = false;
  errorMessage = '';
  phones: { type: string; number: string }[] = [];
  emails: { type: string; email: string }[] = [];
  skills: SkillResponse[] = [];
  address: AddressResponse[] = [];
  trainings: TrainingResponse[] = [];
  educations: EducationResponse[] = [];
  reference: ReferenceResponse[] = [];
  experiences: ExperienceResponse[] = [];
  languages: LanguageResponse[] = [];
  qualifications: QualificationResponse[] = [];
  bdJamCertificate: BDJamCertificateResponse[] = [];
  disability: DisabilityResponse[] = [];
  accomplishments: { portfolio: any[]; publication: any[]; award: any[]; project: any[]; other:any[] } = { portfolio: [], publication: [], award: [], project: [] , other:[]};

  constructor(
    private detailsCvService: DetailsCVService,
    private datePipe: DatePipe,
    private cookieService: CookieService
  ) {}

  get currentAddress(): string {
    const address = this.cvData.address?.find(a => a.addressType === 1);
    return address?.location || 'No current address available';
  }

  get permanentAddress(): string {
    const address = this.cvData.address?.find(a => a.addressType === 2);
    return address?.location || 'No permanent address available';
  }

  getAddressByType(type: number): string {
    const address = this.cvData.address?.find(a => a.addressType === type);
    if (!address || !address.location) {
      return '';
    }
    
    if (address.addressData === address.location) {
      return address.location;
    }
    
    if (address.addressData?.includes(address.location)) {
      return address.addressData;
    }
    if (address.location?.includes(address.addressData)) {
      return address.location;
    }
    
    const parts = [address.addressData, address.location]
      .filter(Boolean)
      .map(part => part.trim())
      .filter((part, index, self) => self.indexOf(part) === index);
      
    return parts.join(', ');
  }

  getFormattedBirthDate(): string {
    return this.datePipe.transform(this.cvData.dateOfBirth, 'MMMM, d, y') || '';
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

  convertDaysToYears(days: number): string {
    if (days === null || days === undefined) return '';
    const years = parseFloat((days / 365).toFixed(1));
    const yearLabel = years === 1.0 ? 'yr' : 'yrs';
    return `${years} ${yearLabel}`;
  }

  convertMonthsToYears(months: number): string {
    if (months === null || months === undefined) return '';
    const years = parseFloat((months / 12).toFixed(1));
    const yearLabel = years === 1.0 ? 'yr' : 'yrs';
    return `${years} ${yearLabel}`;
  }

  calculateEmploymentDuration(startDate: string, endDate: string, isCurrentlyServing: number): string {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return '';
    
    let end: Date;
    if (isCurrentlyServing === 1) {
      end = new Date();
    } else if (endDate) {
      end = new Date(endDate);
      if (isNaN(end.getTime())) return '';
    } else {
      return '';
    }
        const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = parseFloat((diffDays / 365.25).toFixed(1));
    const yearLabel = years === 1.0 ? 'yr' : 'yrs';
    
    return `${years} ${yearLabel}`;
  }

  formatSkillExperience(experience: string): string {
    if (!experience) return '';
    
    // Split multiple skills if they exist
    const skills = experience.split('#*#');
    return skills.map(skill => {
      const [skillName, skillId, experienceValue] = skill.split('^$^');
      
      const value = Number(experienceValue);
      if (isNaN(value)) return skillName;
    
      let years: number;

      if (value >= 400000) {
        years = parseFloat((value / 36961).toFixed(1)); // 443532 / 12
      } else if (value >= 100000) {
        years = parseFloat((value / 14045).toFixed(1)); // 140449 / 10
      } else if (value >= 1000) {
        years = parseFloat((value / 804).toFixed(1)); // 1367 / 1.7
      } else {
        years = parseFloat((value / 365.25).toFixed(1));
      }
      
      const yearLabel = years === 1.0 ? 'yr' : 'yrs';
      
      return `${skillName} (${years} ${yearLabel})`;
    }).join(', ');
  }

  private getDaySuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

   totalMilitaryExperience(): string {
    const start = new Date(this.cvData.commissionDate);
    const end = new Date(this.cvData.retirementDate);
    const diffInYears = ((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(2);
    return diffInYears;
  }


  ngOnInit(): void {
    this.loadCv();
  }

  loadCv(): void {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || ''; // for development only
    const userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
    console.log('User GUID ID Photo Component:', userGuidId);
    const query: GetDetailsCvViewInfoRequest = {
      UserGuid: userGuidId ?? ""
    };

  this.isLoading = true;
  this.detailsCvService.getDetailsCv(query).subscribe({
    next: (res) => {

      if (!res?.event?.eventData || res.event.eventData.length === 0) {
        console.error('Invalid API response structure', res);
        this.isLoading = false;
        return;
      }
      this.cvData = res.event.eventData[0].value;
      console.log("Cv Data", this.cvData);
      console.log("References from API:", this.cvData.reference);


      this.address = this.cvData.address || [];
      this.skills = this.cvData.skills || [];
      this.trainings = this.cvData.training || [];
      this.languages = this.cvData.languages || [];
      this.educations = this.cvData.education || [];
      this.experiences = this.cvData.experience || [];
      this.reference = this.cvData.reference || [];
      console.log("Processed references:", this.reference);
      this.qualifications = this.cvData.qualifications || [];
      this.bdJamCertificate = this.cvData.bdJamCertificate || [];
      this.disability = this.cvData.disability || [];
      
      const rawAccomplishments = this.cvData.accomplishment || [];
      console.log('Raw accomplishments:', rawAccomplishments);
      
      this.accomplishments = {
        portfolio: rawAccomplishments.filter(a => Number(a.accomplishmenttype) === 1),
        publication: rawAccomplishments.filter(a => Number(a.accomplishmenttype) === 2),
        award: rawAccomplishments.filter(a => Number(a.accomplishmenttype) === 3),
        project: rawAccomplishments.filter(a => Number(a.accomplishmenttype) === 4),
        other: rawAccomplishments.filter(a => Number(a.accomplishmenttype) === 5)
      };
      
      console.log('Processed accomplishments:', this.accomplishments);

      this.updateContactInfo();
      this.isLoading = false;
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
    if (this.cvData.mobileNumber) {
      this.phones.push({ type: 'Mobile', number: this.cvData.mobileNumber });
    }
    if (this.cvData.officePhone) {
      this.phones.push({ type: 'Office', number: this.cvData.officePhone });
    }
    if (this.cvData.homePhone) {
      this.phones.push({ type: 'Home', number: this.cvData.homePhone });
    }

    this.emails = [];
    if (this.cvData.primaryEmail) {
      this.emails.push({ type: 'Primary', email: this.cvData.primaryEmail });
    }
    if (this.cvData.secondaryEmail) {
      this.emails.push({ type: 'Secondary', email: this.cvData.secondaryEmail });
    }
  }
}
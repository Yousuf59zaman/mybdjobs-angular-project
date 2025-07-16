import { DecimalPipe } from "@angular/common";

export interface GetDetailsCvViewInfoRequest {
  UserGuid: string;
}

export interface GetDetailsCvViewInfoResponse {
  eventType: number;
  eventData: Array<{
    key: string;
    value: CvViewInfo;
  }>;
  eventId: number;
}

export interface ExperienceUpdated {
  experienceUpdatedOn: string;
}

export interface EducationResponse {
  degree: string;
  instituteName: string;
  majorSubject: string;
  passingYear: number;
  educationLevel: number;
  formerInstitute?: string;
  resultStatus?: string;
  percentageMarks?: number;
  achievements?: string;
  educationId: number;
  courseDurationInMonths?: string;
  gradeScale?: number;
  socialMediaViews?: number;
  educationType?: string;
  otherEducationType?: string;
  boardId?: number;
  foreignInstitutionCountry?: string;
}

export interface TrainingResponse {
  trainingName: string;
  trainingLocation: string;
  trainingCountry: string;
  trainingInstitute: string;
  trainingTopics: string;
  trainingDuration: string;
  trainingId: number;
  trainingYear: number;
}

export interface QualificationResponse {
  projectName: string;
  projectInstitute: string;
  projectLocation: string;
  projectStartDate: string;
  projectEndDate: string;
  projectExperienceId: number;
}

export interface ExperienceResponse {
  companyName: string;
  companyBusiness?: string;
  jobPosition: string;
  department?: string;
  jobDuties?: string;
  companyLocation: string;
  employmentStartDate: string;
  employmentEndDate: string;
  isCurrentlyServing: number;
  experienceId: number;
  jobPostingId: number;
  skillName: string;
  careerProgressionId: number;
  totalWorkExperience: number;
}

export interface SkillResponse {
  sKillId: number;
  nameOfSkill: string;
  profileId?: number;
}

export interface ReferenceResponse {
  referenceId: number;
  referenceName: string;
  referenceOrganization: string;
  referenceDesignation: string;
  referenceAddress: string;
  referencePhone: string;
  referenceHomePhone: string;
  referenceMobile: string;
  referenceEmail: string;
  referenceRelation: string;
}


export interface AddressResponse {
  addressData: string;
  location: string;
  addressType: number;
  hasAddress: number;
}

export interface LanguageResponse {
  languageId: number;
  languageName: string;
  languageReading: string;
  languageWriting: string;
  languageSpeaking: string;
}

export interface CategoryResponse {
  categoryname: string;
}

export interface OrganizationResponse {
  organizationname: string;
}

export interface PreferredLocation {
  preferredCountryLocationId: number;
  preferredCountryLocationName: string;
}

export interface PreferredDistrict {
  preferredDistrictLocationId: number;
  preferredDistrictLocationName: string;
}

export interface BDJamCertificateResponse {
  jobRole: string;
  moduleName?: string;
  examDate: string;
  dateDifference: number;
  isFree: number;
}

export interface AccomplishmentResponse {
  accomplishmenttype: string;
  accomplishmenttitle: string;
  accomplishmenturl: string;
  accomplishmentissuedOn: string;
  accomplishmentdescription: string;
}

export interface DisabilityResponse {
  disabilityId: number;
  showInCV: number;
  disabilityName: string;
  disabilityLevel: string;
  disabilityType: string;
  disabilityTypeId: number;
  disabilityInstanceId: number;
}

export interface CvViewInfo {
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  religion: string;
  birthplace: string;
  heightInCm?: number;
  weightInKg?: number;
  bloodGroup?: string;

  homePhone?: string;
  mobileNumber?: string;
  officePhone?: string;
  primaryEmail?: string;
  secondaryEmail?: string;

  objective?: string;
  careerSummary?: string;
  specialQualifications?: string;
  skillDescription?: string;
  extraCurricularActivities?: string;
  totalExperience: number;
  currentSalary?: number;
  expectedSalary?: number;
  availabilityDate?: string;
  nationalID: number;
  categoryIds?: string;
  preferredJobLocation?: string;
  organizationType?: string;
  folderName: string;
  photoName: string;
  passportNumber: string;
  passportIssueDate: string;
  preferences: string;

  primaryBadgeNumber: string;
  secondaryBadgeNumber: number;
  militaryRank: string;
  serviceBranch: string;
  militaryTrade: string;
  militaryCourse: string;
  commissionDate: string;
  retirementDate: string;

  experienceUpdate: ExperienceUpdated[];
  education: EducationResponse[];
  training: TrainingResponse[];
  qualifications: QualificationResponse[];
  experience: ExperienceResponse[];
  skills: SkillResponse[];
  reference: ReferenceResponse[];

  profileURL?: string;
  profileType?: string;

  address: AddressResponse[];
  countryId?: number;
  districtId?: number;
  thanaId?: number;
  postOfficeId?: number;
  isOutsideBangladesh?: number;

  languages: LanguageResponse[];
  category: CategoryResponse[];
  organization: OrganizationResponse[];
  preferredCountry: PreferredLocation[];
  preferredDistrict: PreferredDistrict[];

  bdJamCertificate: BDJamCertificateResponse[];
  rollNo?: number;

  accomplishment: AccomplishmentResponse[];
  disability: DisabilityResponse[];
}
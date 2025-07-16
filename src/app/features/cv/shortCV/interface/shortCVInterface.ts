// export interface GetShortCvViewInfoRequest {
//   UserGuid: string;
// }
// export interface ExperienceShortResponse {
//   companyName: string;
//   isCurrentlyServing: number;
//   experienceId: number;
//   jobPostingId: number;
//   skillName: string;
//   careerProgressionId: number;
//   totalWorkExperience: number;
// }
// export interface SkillShortResponse {
//   sKillId: number;
//   nameofSkill: string;
// }
// export interface TrainingShortResponse {
//   trainingName: string;
//   trainingInstitute: string;
//   trainingDuration: string;
//   trainingId: number;
// }
// export interface EducationShortResponse {
//   degree: string;
//   instituteName: string;
//   majorSubject: string;
//   passingYear: number;
//   educationLevel: number;
//   formerInstitute?: string;
//   resultStatus?: string;
//   percentageMarks?: number;
//   achievements?: string;
//   educationId: number;
//   courseDurationInMonths?: string;
//   gradeScale?: number;
//   socialMediaViews?: number;
//   educationType?: string;
//   otherEducationType?: string;
//   boardId?: number;
//   foreignInstitutionCountry?: string;
// }
// export interface ReferenceShortResponse {
//   referenceId: number;
//   referenceName: string;
//   referenceMobile: string;
//   referenceRelation: string;
// }

// export interface AddressShortResponse {
//   addressId: number;
//   displayLocation: string;
//   location: string;
//   countryId: number;
//   districtId: number;
//   postOfficeId: number;
//   isOutsideBangladesh: number;
//   addressType: number;
//   hasAddress: number;
// }
// export interface GetShortCvViewInfoResponse {
//   fullName: string;
//   fatherName: string;
//   motherName: string;
//   dateOfBirth: string;
//   gender?: string;
//   currentLocation?: string;
//   permanentAddress?: string;
//   homePhone?: string;
//   mobileNumber?: string;
//   officePhone?: string;
//   primaryEmail?: string;
//   secondaryEmail?: string;
//   nationalID?: string;
//   nationality?: string;
//   passportNumber?: string;
//   passportIssueDate?: string;
//   profileURL?: string;
//   linkedInURL?: string;
//   otherSocialURL?: string;
//   birthPlace?: string;
//   height?:string;
//   weight?:string;
//   photoName: string;
//   folderName: string;

//   totalExperience: number;
//   experienceShort: ExperienceShortResponse[];
//   skillShort: SkillShortResponse[];
//   trainingShort: TrainingShortResponse[];
//   educationShort: EducationShortResponse[];
//   referenceShort: ReferenceShortResponse[];

//   addressShort: AddressShortResponse[];

//   previousAddress?: string;

//   // addressId: number;
//   // displayLocation: string;
//   // location: string;
//   // countryId: number;
//   // districtId: number;
//   // postOfficeId: number;
//   // isOutsideBangladesh: number;
//   // addressType: number;
//   // previousAddress?: string;
//   // hasAddress: number;
// }



export interface GetShortCvViewInfoRequest {
  UserGuid: string;
}

export interface GetShortCvViewInfoResponse {
  eventType: number;
  eventData: Array<{
    key: string;
    value: GetShortCvViewInfo;
  }>;
  eventId: number;
}export interface GetShortCvViewInfo {
  personalInfoShortResponse: PersonalInfoShortResponse;
  experienceShort: ExperienceShort[];
  skillShort: SkillShort[];
  trainingShort: TrainingShort[];
  educationShort: EducationShort[];
  referenceShort: ReferenceShort[] | null;
  addressShort: AddressShort[];
}

export interface PersonalInfoShortResponse {
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  height: string;
  weight: string;
  currentLocation: string;
  permanentAddress: string;
  homePhone: string;
  mobileNumber: string;
  officePhone: string;
  primaryEmail: string;
  secondaryEmail: string;
  nationalID: string;
  nationality: string;
  passportNumber: string;
  passportIssueDate: string;
  profileURL: string;
  photoName: string;
  folderName: string;
  birthPlace: string;
  totalExperience: number;
}

export interface ExperienceShort {
  companyName: string;
  isCurrentlyServing: number;
  experienceId: number;
  jobPostingId: number;
  skillName: string;
  careerProgressionId: number;
  totalWorkExperience: number;
}

export interface SkillShort {
  sKillId: number;
  nameofSkill: string;
}

export interface TrainingShort {
  trainingName: string;
  trainingInstitute: string;
  trainingDuration: string;
  trainingId: number;
}

export interface EducationShort {
  degree: string;
  instituteName: string;
  majorSubject: string;
  passingYear: number;
  educationLevel: number;
  formerInstitute?: string | null;
  resultStatus?: string | null;
  percentageMarks: number;
  achievements?: string | null;
  educationId: number;
  courseDurationInMonths?: string | null;
  gradeScale?: number | null;
  socialMediaViews: number;
  educationType: string;
  otherEducationType?: string | null;
  boardId: number;
  foreignInstitutionCountry?: string | null;
}

export interface ReferenceShort {
  referenceId: number;
  referenceName: string;
  referenceMobile: string;
  referenceRelation: string;
}

export interface AddressShort {
  addressId: number;
  displayLocation: string;
  location: string;
  countryId: number;
  districtId: number;
  postOfficeId: number;
  isOutsideBangladesh: number;
  addressType: number;
  hasAddress: number;
  previousAddress?: string | null;
}
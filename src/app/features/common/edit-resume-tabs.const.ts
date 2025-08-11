

export const MainTabs: TabsElementModel[] = [
  { id: 1, paramMainId: 'pi', value: 'maintab-personal-info', name: 'Personal Information', iconClass: 'icon-user' },
  { id: 2, paramMainId: 'ed', value: 'maintab-education-training', name: 'Education/Training', iconClass: 'icon-graduation-cap' },
  { id: 3, paramMainId: 'em', value: 'maintab-employment', name: 'Employment', iconClass: 'icon-briefcase' },
  { id: 4, paramMainId: 'oi', value: 'maintab-other-info', name: 'Other Information', iconClass: 'icon-list' },
  { id: 5, paramMainId: 'ac', value: 'maintab-accomplishment', name: 'Accomplishment', iconClass: 'icon-skill-note-book1' },
];

export const PersonalInfoSubtabs: TabsElementModel[] = [
  { id: 1, paramSubId: 'pd', value: 'personal-details', name: 'Personal Details' },
  { id: 2, paramSubId: 'add', value: 'address-details', name: 'Address Details' },
  { id: 3, paramSubId: 'crr', value: 'career-application', name: 'Career and Application' },
  { id: 4, paramSubId: 'prf', value: 'preferred-areas', name: 'Preferred Areas' },
  { id: 5, paramSubId: 'oii', value: 'other-information', name: 'Other Information' },
  { id: 6, paramSubId: 'dis', value: 'disability-information', name: 'Disability Information' },
];

export const EducationSubTabs: TabsElementModel[] = [
  { id: 1, paramSubId: 'as', value: 'academic-summary', name: 'Academic Summary' },
  { id: 2, paramSubId: 'ts', value: 'training-summary', name: 'Training Summary' },
  { id: 3, paramSubId: 'cs', value: 'certification-summary', name: 'Professional Certification Summary' },
];

export const EmploymentSubTabs: TabsElementModel[] = [
  { id: 1, paramSubId: 'emh', value: 'employment-history', name: 'Employment History ' },
  { id: 2, paramSubId: 'arh', value: 'retr-army-employment-history', name: 'Employment History(For Retired Army Person)' },
];

export const OtherInfoSubTabs: TabsElementModel[] = [
  { id: 1, paramSubId: 'skl', value: 'other-info-skill', name: 'Skill' },
  { id: 2, paramSubId: 'ec', value: 'other-info-extra-curricular', name: 'Extracurricular Activities' },
  { id: 3, paramSubId: 'lp', value: 'other-info-lang-proficiency', name: 'Language Proficiency' },
  { id: 4, paramSubId: 'lc', value: 'other-info-link-account', name: 'Link Accounts' },
  { id: 5, paramSubId: 'ref', value: 'other-info-references', name: 'References' },
];

export const AccomplishmentSubTabs: TabsElementModel[] = [
  { id: 1, paramSubId: 'pf', value: 'accomplishment-portfolio', name: 'Portfolio' },
  { id: 2, paramSubId: 'pb', value: 'accomplishment-publications', name: 'Publications' },
  { id: 3, paramSubId: 'awd', value: 'accomplishment-awards', name: 'Award/Honors' },
  { id: 4, paramSubId: 'pjc', value: 'accomplishment-projects', name: 'Projects' },
  { id: 5, paramSubId: 'oth', value: 'accomplishment-others', name: 'Others' },
];


export const Tabs: TabsElementModel[] = [
  { id: 1, value: 'details-cv', name: 'Details CV'},
  { id: 2, value: 'short-cv', name: 'Short-CV'},
];

export interface TabsElementModel {
  id: number;
  value: string;
  paramMainId?: string;
  paramSubId?: string;
  name: string;
  iconClass?: string;
}

export interface TabEmitterModel {
  mainTab: string;
  subTab: TabsElementModel;
}

export enum SubTabParamIds {
  subPersonalDetails = 'pd',
  subAddressDetails = 'add',
  subCareerApplication = 'crr',
  subPreferredArea = 'prf',
  subOtherInfo = 'oii',
  subDisabilityInfo = 'dis',
  subAcademicSummary = 'as',
  subTrainingSummary = 'ts',
  subCertificationSummary = 'cs',
  subEmpHistory = 'emh',
  subArmyHistory = 'arh',
  subSkill = 'skl',
  subExtraCurricular = 'ec',
  subLangProf = 'lp',
  subLinkAcc = 'lc',
  subReferences = 'ref',
  subPortfolio = 'pf',
  subPublications = 'pb',
  subAwards = 'awd',
  subProjects = 'pjc',
  subOthers = 'oth'
}
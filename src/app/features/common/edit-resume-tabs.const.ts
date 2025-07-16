

export const MainTabs: TabsElementModel[] = [
  { id: 1, value: 'maintab-personal-info', name: 'Personal Information', iconClass: 'icon-user' },
  { id: 2, value: 'maintab-education-training', name: 'Education/Training', iconClass: 'icon-graduation-cap' },
  { id: 3, value: 'maintab-employment', name: 'Employment', iconClass: 'icon-briefcase' },
  { id: 4, value: 'maintab-other-info', name: 'Other Information', iconClass: 'icon-list' },
  { id: 5, value: 'maintab-accomplishment', name: 'Accomplishment', iconClass: 'icon-skill-note-book1' },
];

export const PersonalInfoSubtabs: TabsElementModel[] = [
  { id: 1, value: 'personal-details', name: 'Personal Details' },
  { id: 2, value: 'address-details', name: 'Address Details' },
  { id: 3, value: 'career-application', name: 'Career and Application' },
  { id: 4, value: 'preferred-areas', name: 'Preferred Areas' },
  { id: 5, value: 'other-information', name: 'Other Information' },
  { id: 6, value: 'disability-information', name: 'Disability Information' },
];

export const EducationSubTabs: TabsElementModel[] = [
  { id: 1, value: 'academic-summary', name: 'Academic Summary' },
  { id: 2, value: 'training-summary', name: 'Training Summary' },
  { id: 3, value: 'certification-summary', name: 'Professional Certification Summary' },
];

export const EmploymentSubTabs: TabsElementModel[] = [
  { id: 1, value: 'employment-history', name: 'Employment History ' },
  { id: 2, value: 'retr-army-employment-history', name: 'Employment History(For Retired Army Person)' },
];

export const OtherInfoSubTabs: TabsElementModel[] = [
  { id: 1, value: 'other-info-skill', name: 'Skill' },
  { id: 2, value: 'other-info-extra-curricular', name: 'Extracurricular Activities' },
  { id: 3, value: 'other-info-lang-proficiency', name: 'Language Proficiency' },
  { id: 4, value: 'other-info-link-account', name: 'Link Accounts' },
  { id: 5, value: 'other-info-references', name: 'References' },
];

export const AccomplishmentSubTabs: TabsElementModel[] = [
  { id: 1, value: 'accomplishment-portfolio', name: 'Portfolio' },
  { id: 2, value: 'accomplishment-publications', name: 'Publications' },
  { id: 3, value: 'accomplishment-awards', name: 'Award/Honors' },
  { id: 4, value: 'accomplishment-projects', name: 'Projects' },
  { id: 5, value: 'accomplishment-others', name: 'Others' },
];


export const Tabs: TabsElementModel[] = [
  { id: 1, value: 'details-cv', name: 'Details CV'},
  { id: 2, value: 'short-cv', name: 'Short-CV'},
];

export interface TabsElementModel {
  id: number;
  value: string;
  name: string;
  iconClass?: string;
}

export interface TabEmitterModel {
  mainTab: string;
  subTab: TabsElementModel;
}
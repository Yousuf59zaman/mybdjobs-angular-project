export interface Education {
  ed_ID: number;
  levelOfEducation: number;
  instituteName: string;
  concentrationOrMajorOrGroup: string;
  yearOfPassing: number;
  examOrDegreeOrTitle: string;
  isForeignInstitute: boolean;
  result: number;
  cgpaOrMarks: number;
  achievement: string;
  courseDuration: string;
  gradeScale: number;
  showDegreeToEmployers: boolean;
  showDegree: boolean;
  boardID: number;
  countryOfForeignUniversity: string;
  educationTypeId: number;
}


export interface EventData {
  key: string;
  value: Education[];
}

export interface EducationResponse {
  event  :Event
}

export interface Event {
  eventType: number;
  eventData: EventData[];
  eventId: number;
}
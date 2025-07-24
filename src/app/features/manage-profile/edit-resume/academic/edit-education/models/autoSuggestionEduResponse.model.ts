export interface autoSuggestionEduResponse {
  event: Event;
}

export interface Event {
  eventType: number;
  eventData: EventData[];
}

export interface EventData {
  key: string;
  value: Data[];
}

export interface Data {
  majorSubjectResponse: MajorSubjectResponse[]; 
  instituteResponse: InstituteResponse[];
}

export interface InstituteResponse {
  instituteID: string;
  instituteName: string;
}

export interface MajorSubjectResponse {
  majoR_ID: number,
  majoR_Name: string
}


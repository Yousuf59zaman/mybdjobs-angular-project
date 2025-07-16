export interface PersonalDetailsPayload {
  userGuid: string;
  firstName: string;
  lastName: string;
  fName: string;
  mName: string;
  birth: string; // ISO date string
  sex: string;
  mStatus: number;
  nationality: string;
  religion: string;
  nid: string;
  mobile: string;
  passportNo: string;
  passportIssueDate: string; // ISO date string
  email1: string;
  email2: string;
  officePhone: string;
  homePhone: string;
  bloodGroup: string;
  birthPlace: string;
  height: string;
  weight: string;
  countryCode: number;
  updatedOn: string; // ISO date string
  bflag: number;
}
export interface ApiResponse {
  eventType: number;
  eventData: {
    key: string;
    value: string;
  }[];
  eventId: number;
}
export interface AutoSuggestionRequest {
  condition: string;
  banglaField: string;
  con1: string;
  examTitle: string;
  langType: string;
  param: string;
  strData: string;
}

export interface LocationResponse {
  locationID: string;
  locationName: string;
}

export interface AutoSuggestionValueItem {
  locationResponse: LocationResponse[] | null;
  orgTypeResponse: any; // You can replace 'any' with appropriate interfaces later
  majorSubjectResponse: any;
  instituteResponse: any;
  companyProfileResponse: any;
  dataFieldValueResponse: any;
  skillResponse: any;
}

export interface AutoSuggestionEventData {
  key: string;
  value: AutoSuggestionValueItem[];
}

export interface AutoSuggestionResponse {
  eventType: number;
  eventData: AutoSuggestionEventData[];
  eventId: number;
}

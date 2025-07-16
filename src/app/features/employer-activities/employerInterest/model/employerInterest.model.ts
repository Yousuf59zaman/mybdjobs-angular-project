export interface employerInterestResponse {
  event  :Event
}
export interface Event {
  eventType: number;
  eventData: EventData[];
  eventId: number;

}
export interface EventData {
  key: string;
  value: {
    isProUser: boolean;
    employerInterestList: CompanyActivity[];
    employerInterestListCommon: {
      totalInterestedCompany: number;
      totalCompanyViewedCv  : number;
    };
  };
}

export interface CompanyActivity {
  companyId: number;
  companyName: string;
  lastActivityDate: string;
}
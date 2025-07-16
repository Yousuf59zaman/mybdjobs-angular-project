export interface EmployerViewResponse {
  event  :Event;
}

export interface Event {
  eventType: number;
  eventData: EventData[];
  eventId: number;
}

export interface EventData {
  key: string;
  value: {
      data: EmployerViewCvItem[];
      common: {
        isproUser: boolean;
        totalNumberOfItems: number;
        totalNumberOfPage: number;
        totalCompanyViewed: number;
      };
  };
}


export interface EmployerViewCvItem {
  slNo: number;
  companyName: string;
  jobTitle: string | null;
  viewedFrom: string;
  viewedOn: string; // could use Date if you plan to parse it
  viewBdjobsResume: number;
  viewPersonalizedResume: number;
  viewVideoResume: number;
  viewSummaryView: number;
  employerInterested: number;
  numberOfTotalViewed: number;
}



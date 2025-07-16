  export interface ActivityFlowResponse {
     event  : Event;
  }

  export interface Event{
    eventType: number;
    eventData: EventData[];
    eventId: number;
  }
  
  export interface EventData {
    key: string;
    value: EventValue;
  }
  
  export interface EventValue {
    data: JobActivity[];
    common: CompanyCommon;
  }
  
  export interface JobActivity {
    jobId: number;
    jobTitle: string;
    appliedDate: string;
    step: JobStep[];
  }
  
  export interface JobStep {
    stepName: string;
    stepType: string;
    stepDate: string;
  }
  
  export interface CompanyCommon {
    companyId: number;
    companyName: string;
    totalJob: number;
  }
  
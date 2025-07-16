
export interface EventData<T> {
  key:   string;
  value: T;
}
export interface DeleteShortlistedJobsRequest {
  GuidId: string;
  //JobIds: number[];
  JP_ID: string;
}
export interface ApiResponse<T = any> {
  eventType: number;
  eventData:  EventData<T[]>[];
  eventId:   number;
}

export interface ShortlistedJob {
  jP_ID:     number;
  jobTitle:  string;
  company:   string;
  deadline:  string;  
  jobLang:   number;
  totalJob:  number;
}

export interface ShortlistedJobsRequest {
  CurrentPage:  number;         
  GuidId:       string;       
  PerPageData:  number;        
  LanType:      string;    
  SearchData:   string | null;  
  FromDate:     string | null;  
  ToDate:       string | null;
}

export interface QueryPayload {
  GuidId: string;
  intCurPage: number;
  intNoOfRecordPerPage: number;
  strLastDate?: string;
}

export interface FavouriteSearchResponse {
  filterName: string;
  savedOn: string;
  smsNotification: string | null;
  sfID: number;
  availableJobs?: number;
}
export interface SubscribePayload {
  UserGuid: string;
  SubscribeValue: string;
  SFID: number;
}

export interface AvailableJobsResponse {
  event: {
    eventType: number;
    eventData: AvailableJobsEventData[];
    eventId: number;
  };
}
interface AvailableJobsEventData {
  key: string;
  value: string;
}

export interface EventData<T> {
  key: string;
  value: T;
}

export interface ApiResponse<T = any> {
  eventType: number;
  eventData: EventData<T[]>[];
  eventId: number;
}
export interface DeletePayload {
  UserGuid: string;
  sfID: number;
}
export interface ApiWrapper<T> {
  event: ApiResponse<T>;
}

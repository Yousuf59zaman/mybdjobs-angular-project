export interface deleteEducationResponse {
  eventType: number;
  eventData: EventDataItem[];
  eventId: number;
}

export interface EventDataItem {
  key: string;
  value: string;
}
export interface saveEduResponse {
  eventType: number;
  eventData: EventDataItem[];
  eventId: number;
}

export interface EventDataItem {
  key: string;
  value: string;
}
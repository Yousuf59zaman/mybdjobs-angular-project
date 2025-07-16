export interface LocationResponse {
  event  :Event
}

export interface Event {
  eventType: number;
  eventData: EventData[];
  eventId: number;
}

export interface EventData {
  key: string;
  value: Location[];
}

export interface Location {
  id: number;
  nameinEnglish: string;
  nameinBangla: string | null;
}







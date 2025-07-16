export interface CountryResponse {
  event  :Event
}

export interface Event {
  eventType: number;
  eventData: EventData[];
  eventId: number;
}

export interface EventData {
  key: string;
  value: Country[];
}

export interface Country {
  countryId: number;
  countryName: string;
  countryNameBangla: string | null;
}


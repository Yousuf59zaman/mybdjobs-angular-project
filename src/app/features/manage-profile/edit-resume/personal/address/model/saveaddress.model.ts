export interface EventData {
  key: string;
  value: string;
}

export interface saveAddressResponse {
    eventType: number;
    eventData: EventData[];
    eventId: number;
  
}


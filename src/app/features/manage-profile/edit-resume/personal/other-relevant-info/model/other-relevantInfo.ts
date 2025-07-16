export interface GetOtherRelevantInfoQuery {
  UserGuid: string;
}

export interface OtherRelevantInfo {
  careeR_SUMMARY: string;
  spequa:         string;
  keywords:       string;
}

export interface EventData {
  key:   string;
  value: OtherRelevantInfo;
}

export interface OtherRelevantInfoPayload {
  eventType: number;
  eventData: EventData[];
  eventId:   number;
}

export interface GetOtherRelevantInfoResponse {
  event: OtherRelevantInfoPayload;
}

export interface UpdateOtherRelevantInfo {
  userGuid:            string;
  career_Summary:      string;
  special_Qualification: string;
  keyWords:            string;
}

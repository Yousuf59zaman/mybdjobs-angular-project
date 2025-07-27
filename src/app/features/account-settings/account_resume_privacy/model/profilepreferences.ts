export interface BlockedCompanyIdsInfo {
  id: number;
  name?: string;
}

export interface PrivacyStatus {
  profileVisibilityStatus: number;
  blockedCompanyIdsInfos: BlockedCompanyIdsInfo[];
  availabilityStatus: boolean;
  isShowVideoResume: boolean;
}

export interface PrivacyStatusEvent {
  event: {
    eventType: number;
    eventData: {
      key: string;
      value: PrivacyStatus;
    }[];
    eventId: number;
  };
}

// POST request interface for availability status
export interface AvailabilityStatusRequest {
  userGuid: string;
  isAvailable: boolean;
}

// POST response interface for availability status
export interface AvailabilityStatusResponseEvent {
  eventType: number;
  eventData: {
    key: string;
    value: string;
  }[];
  eventId: number;
}
export interface VideoResumeResponseEvent {
  eventType: number;
  eventData: {
    key: string;
    value: string;
  }[];
  eventId: number;
}
// PUT request interface for video resume status
export interface VideoResumeStatusRequest {
  userGuid: string;
  isAvailable: boolean;
}

export interface CompanySuggestionRequest {
  strData: string;  // Search term
  langType?: string; // Optional language
  param?: string;    // Always '8' for companies
}

export interface CompanyProfileResponse {
  cP_ID: string;
  name: string;
}

export interface SuggestionEvent {
  eventType: number;
  eventData: Array<{
    key: string;
    value: any[];
  }>;
  eventId: number;
}

export interface AutoSuggestionEventResponse {
  event: SuggestionEvent;
}
export interface ProfileVisibilityRequest{
  userGuid: string,
  corporateIds?: string;
  option: number
}
export interface ProfileVisibilityResponseEvent {
  eventType: number;
  eventData: {
    key: string;
    value: string;
  }[];
  eventId: number;
}
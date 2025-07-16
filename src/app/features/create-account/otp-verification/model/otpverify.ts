export interface OtpData {
    tempUserId?: number;
    userGuidId: string
    otpCode: number;
    isFromTTC: boolean;
    sendOtpToMobileOrEmail: string;
    createdFrom: number;
  }
  
  export interface EventDatum {
    key: string;
    value: string;
  }
  
  export interface OtpApiResponse {
    eventType: number;
    eventData: EventDatum[];
    eventId: number;
  }
  
  export interface serviceData {
    userid: string,
    companyId: string,
    systemId: number,
    jobseekerGuid: string,
    decodeId: string,
    isFromMis: boolean
  }
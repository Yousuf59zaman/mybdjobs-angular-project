
export interface ProfessionalCertification {
  pe_ID: number;
  certificationTitle: string;
  institute: string;
  location: string;
  fromDate: string;
  toDate: string;
}

export interface ProfessionalCertificationResponse {
  event: {
    eventType: number;
    eventData: {
      key: string;
      value: ProfessionalCertification[];
    }[];
    eventId: number;
  };
}
export interface ProfessionalCertificationPayload {
  certification: string;
  institute: string;
  location: string;
  startDate: string;   // ISO string, e.g. "2025-06-02T11:18:03.628Z"
  endDate: string;     // ISO string
  userGuid: string;
  pe_ID: number;
}
export interface PostApiResponse
{
  eventType: number;
    eventData: {
      key: string;
      value: ProfessionalCertification[];
    }[];
    eventId: number;
}
export interface InsertProfessionalCertificate
{
  certification: string;
  institute: string;
  location: string;
  startDate: string;
  endDate: string;
  userGuid: string;
}
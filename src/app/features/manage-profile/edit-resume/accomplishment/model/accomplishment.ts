
export enum AccomplishmentType {
  PORTFOLIO = 1,
  PUBLICATION = 2,
  AWARD = 3,
  PROJECT = 4,
  OTHERS = 5,

}

export interface AccomplishmentInfoQuery {
  UserGuid?: string;
}

export interface AccomplishmentEventDataItem {
  accomPlishmentId: number;
  type: AccomplishmentType;
  title: string;
  url: string;
  issuedOn: string | null;
  description: string;
}

export interface AccomplishmentUpdateInsert {
  userGuid: string;
  title: string;
  url: string;
  issueDate: string;
  description: string;
  type: AccomplishmentType;
  id?: number | null;
}

export interface AccomplishmentEventData {
  key: string;
  value: AccomplishmentEventDataItem[];
}

export interface AccomplishmentEvent {
  eventType: number;
  eventData: AccomplishmentEventData[];
  eventId: number;
}

export interface AccomplishmentResponse {
  event: AccomplishmentEvent;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface DeleteAccomplishmentRequest {
  acmId: number;
  userGuid: string;
}

export interface DeleteAccomplishmentResponse {
  eventType: number;
  eventData: {
    key: string;
    value: string[];
  }[];
  eventId: number;
}
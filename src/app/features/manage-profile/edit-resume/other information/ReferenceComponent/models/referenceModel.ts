export interface EventResponse {
  event:{
      eventType: number;
  eventData: EventData[];
  eventId: number;
  }
}

export interface EventData{
    key: string
    value: ReferenceModel[]
}

export interface ReferenceModel {
  referenceId : number;
  name: string;
  designation: string;
  organization: string;
  email: string;
  relation: string;
  mobile: string;
  officialPhoneNo: string;
  residentalPhoneNo: string;
  address: string;
}

export interface UpdateReferencePayload {
  r_ID: number;
  userGuid: string;
  referenceName: string;
  organization: string;
  designation: string;
  address?: string | null;
  phoneOffice?: string | null;
  phoneHome?: string | null;
  mobile?: string | null;
  email?: string | null;
  relation?: string | null;
}
export interface InsertReferencePayload {
  userGuid: string;
  name: string;
  designation: string;
  organization: string;
  email?: string | null;
  relation?: string | null;
  mobile?: string | null;
  phone_Office?: string | null;
  phone_Home?: string | null;
  address?: string | null;
}
export interface DeleteReferencePayload
{
  userGuid : string;
  referenceId: number;
}
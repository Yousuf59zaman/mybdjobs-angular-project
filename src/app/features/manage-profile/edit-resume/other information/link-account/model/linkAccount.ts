export interface LinkQuery{
   UserGuid: string;
}


export interface LinkResponse{
   otherProfileId: number,
   profileType:string,
   profileUrl:string,
}


export interface EventData {
key: string;
value: LinkResponse[];
}


export interface LinkPayload {
eventType: number;
eventData: EventData[];
eventId: number;
}



export interface LinkInfoResponse {
event: LinkPayload;
}


export interface InsertLinkPayload {
  userGuid: string;
  profile_Type: string;
  profile_URL: string;
}

export interface UpdateLinkPayload{
  otherProfileId: number;
  profile_Url: string;
  profile_Type: string;
  userGuid: string;
}

export interface DeleteLinkPayload{
   otherProfileId: number;
   userGuid: string;
}
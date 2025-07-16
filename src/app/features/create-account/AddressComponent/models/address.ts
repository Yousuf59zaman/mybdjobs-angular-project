export interface District {
  id: number;
  nameinEnglish: string;
  nameinBangla: string;
}

export interface LocationApiResponse {
  event: LocationResponse
}
  
export interface LocationResponse {
  eventType: number;
  eventData: { key: string; value: District[] }[];
  eventId: number;
}
  
export interface PostLocation {
  GuidId : string;
  DistrictId? : string;
  ThanaId? : string;
  PostOfficeId? : string;
  HouseNoOrRoadVillage? : string;
  AlternativePhone? : string;
  LanType? : string;
  IsOutsideBd? : number;
  Session_date? : Date;
}
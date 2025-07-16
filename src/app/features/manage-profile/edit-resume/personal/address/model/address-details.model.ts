export interface addressDetailsResponse {
  event  :Event
}

export interface Event {
  eventType: number;
  eventData: EventData[];
  eventId: number;
}

export interface EventData {
  key: string;
  value: Address[];
}

export interface Address {
  addID: number;
  displayLocation: string;
  location: string;
  countryID: number;
  districtID: number;
  thanaID: number;
  postOfficeID: number;
  outsideBD: string; // if you want, you can use `boolean` and convert accordingly
  addressType: number;
  oldAddress: string | null;
  updatedOn: string; // optionally convert to `Date` if needed
  addressHave: number;
  postOfficeName: string;
  thanaName: string;
  permanentPostOfficeName: string;
  permanentThanaName: string;
  districtName  :string;
  countryName  : string;
  postOfficeNameBN  : string;
  thanaNameBN  : string;
  permanentPostOfficeNameBN: string;
  permanentThanaNameBN: string;
  districtNameBN: string;
  countryNameBN : string;
           
}
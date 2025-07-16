export interface GetCareerInfoQuery {
  UserGuid: string;
}

export interface CareerInfoPayload {

  eventType: number;
  eventData: EventData[];
  eventId: number;
}

export interface CareerInfoResponse {
  event: CareerInfoPayload;
}

export interface EventData {

  key: string;
  value: CareerInfo;
}

export interface CareerInfo {
  obj: string;
  cur_Sal: number;
  exp_Sal: number;
  available: string;
  pref: string;
}
export interface UpdateCareerInfo {
  userGuid: string;
  objective: string;
  present_Salary: number;
  expected_Salary: number;
  available: string;
  job_Level: string;
  isWebOrApp: number;
}

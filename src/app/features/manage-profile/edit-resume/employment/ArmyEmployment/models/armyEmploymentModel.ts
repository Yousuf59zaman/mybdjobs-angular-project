export interface ArmyHistoryItem {
  bA_No: string;
  bA_Number: number;
  rank: string;
  type: string;
  arms: string;
  trade: string;
  course: string;
  dateOfCommision: string;
  dateOfRetirement: string;
  retiredArmyId: string;
  verifyStatus: number;
}

export interface EventDataItem {
  key: string;
  value: ArmyHistoryItem[];
}
export interface PostArmyDetails {
  bA_No: string;
  bA_Number: number;
  rank: string;
  type: string;
  arms: string;
  trade: string;
  course: string;
  dateOfCommision: string;
  dateOfRetirement: string;
  retiredArmyId: string;
  userGuidId: string;
  version: string;
}

export interface GetEventResponse {
  event: {
    eventType: number;
    eventData: EventDataItem[];
    eventId: number;
  };
}
export interface PostApiReponse {
  eventType: number;
  eventData: PostResponseDataItem[];
  eventId: number;
}

export interface PostResponseDataItem
{
  key: string;
  value: string;
}

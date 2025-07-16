export interface DisabilityApiResponse {
  event: EventPayload;
}

export interface EventPayload {
  eventType: number;
  eventData: EventData[];
  eventId: number;
}

export interface EventData {
  key: string;
  value: DisabilityRecord[];
}

export interface DisabilityRecord {
  p_Id:                number;
  disabilityID:        string;
  iscvDisAbilityShow:  number;
  disabiltiy_Name:     string;  // note spelling from payload
  disability_Level:    string;
  disability_Type:     string;
  dtID:                number;
  diID:                number;
}

export interface DisabilityInfoPayload {
  userGuid: string;
  isDisabilityInfoGiven: number;
  disAbilityId: string; // Disability ID will go here
  isShownOnCv: number; // Show on CV if yes then 1 else 0
  isDeleteRequest: number;

  seenProblemVal: string;
  seenProblemDtID: string;
  seenProblemDiID: string;

  hearProblemVal: string;
  hearProblemDtID: string;
  hearProblemDiID: string;

  sswcProblemVal: string;
  sswcProblemDtID: string;
  sswcProblemDiID: string;

  concProblemVal: string;
  concProblemDtID: string;
  concProblemDiID: string;

  commProblemVal: string;
  commProblemDtID: string;
  commProblemDiID: string;

  tcareProblemVal: string;
  tcareProblemDtID: string;
  tcareProblemDiID: string;
}

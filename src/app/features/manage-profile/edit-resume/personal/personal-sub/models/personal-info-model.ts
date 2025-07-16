export interface EventDataValue {
  accFirstName: string;
  accLastName: string;
  accGender: string;
  accPhone: string;
  accEmail: string;
  accCatID: number;
  fName: string;
  mName: string;
  birth: string;
  m_Status: string;
  nationality: string;
  relegion: string;
  present_Add: string | null;
  permanent_Add: string | null;
  current_Location: string | null;
  home_Phone: string;
  office_Phone: string;
  e_mail2: string;
  obj: string;
  cur_Sal: number;
  exp_Sal: number;
  pref: string;
  available: string;
  caT_IDs: string;
  pref_Job_Location: string;
  type_Of_Org: string;
  career_Summary: string;
  spequa: string;
  keywords: string;
  nid: string;
  accUNtype: string;
  birthPlace: string;
  pHeight: number;
  pWeight: number;
  passportNo: string;
  passportIssueDate: string;
  accCountryCode: string;
  bloodGroup: string;
  photo: string;
  isSuccess: boolean;
  message: string | null;
}

export interface EventData {
  key: string;
  value: EventDataValue;
}

export interface PersonalInfoApiResponse {
  eventType: number;
  eventData: EventData[];
  eventId: number;
}


export interface SelectItem
{
  label: string;
  value: string;
}
export interface ApiResponse {
  event: PersonalInfoApiResponse;
}
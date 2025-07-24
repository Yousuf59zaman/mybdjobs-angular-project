export interface CheckUserNameExist {
  UserGuid: string;
  NewUserName: string;
  OldPassword: string | null;
}
export interface EventDataItem {
  key: string;
  value: string;
}
export interface CheckUserNameExistResponse {
  event:{
    eventType: number;         // 1 = success/unique, 2 = error/not unique
    eventData: EventDataItem[]; // array of key/value pairs
    eventId: number;
  };
}
export interface ApiEventResponse {
  eventType: number;
  eventData: EventDataItem[];
  eventId: number;
}
export interface SendOtpCodeInEmail {
  userGuid: string;
  userName: string;
  newUserName: string;
}

export interface SendOtpRequest {
  userGuid: string;
  userName: string;  // Current username (email/mobile)
  newUserName?: string | null;  // Only for email changes
 
}
export interface SendOtpData {
  UserGuidId: string;
  UserName: string;
  OTP: string;
}
export interface UpdateUserName
{
  userGuid: string,
  newUserName: string,
  userType: number
}
export interface UpdateUserResponse{
  key: string;
  value: UpdateUserName;
}
export interface UpdateUserInfoResponse {

    eventType: number;                    // 1 = success, 2 = error
    eventData: UpdateUserResponse[];  // array of key/value pairs
    eventId: number;
  
}

export interface ChangeUserIdQuery {
  userGuid: string;
}

export interface CheckUserInfoResponse {
  event: {
    eventType: number;                    // 1 = success, 2 = error
    eventData: EventDataItemWithValue[];  // array of key/value pairs
    eventId: number;
  };
}

export interface EventDataItemWithValue {
  key: string;
  value: UserInfoPayload | string;
}

export interface UserInfoPayload {
  userNameType: number;
  userName: string;
  hasPassword: boolean;
  categoryId: number;
  socialMediaId: number;
  socialMediaName: string | null;
}
import { UserId } from '../../../shared/enums/app.enums';

export interface UserInfoReqBody {
    username: string,
    purpose: string
}

export interface ApiResponse<T> {
    eventType: number;
    eventId: number;
    eventData: EventData<T>[];
}
export interface EventData<T> {
    key: string,
    value: T
}
export interface checkUserNameResponse {
    username: string | null,
    result: string,
    fullName: string,
    emailAddress: string,
    status: number,
    // jobseekerId:string,
    photoUrl: string,
    isAccountActive: boolean,
    phoneNumber: string,
    otp: number,
    purpose: string,
    guidId: string
}

export interface checkUserNameRequest {
    username: string,
    purpose: string
}

export interface authApiRequest {
    userName: string | null;
    password: string | null;
    systemId: number;
    userid: string;
    otp: string | number;
    isForOTP: boolean;
    socialMediaName: string;
    guidId: string | undefined;
    socialMediaId: string;
    socialMediaAutoIncrementId: number;
    purpose: string | undefined;
    referPage: string;
    version: string;
}


export interface AuthApiResponse {
    message: string
    token: string
    refreshToken: string,
    encryptId: string
}

export interface getUserListResponse {
    userGuid: string,
    userName: string,
    fullName: string,
    phone: string,
    email: string,
    socialMediaName: string | null,
    profilePicture: string,
    requestType: string,
    emailOrigin: string,
    lastLogIn: string,
    logInStatus: string,
    isCvPosted: boolean

}

export interface sendOtpRequest {
    userGuid: string,
    recoveryType: number,
    dateOfBirth: string,
    requestType: string,
    userName: string
}

export interface editPasswordRequest {
    userGuidId: string,
    username: string,
    newPassword: string,
    confirmPassword: string,
}

// export interface sendOtpResponse{

// }
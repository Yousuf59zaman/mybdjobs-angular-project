export interface ChangePasswordRequest {
  userGuidId: string;
  userName: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  isSocialMedia: boolean;
  otp?: string; 
}
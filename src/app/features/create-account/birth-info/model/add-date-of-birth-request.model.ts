export interface AddDateOfBirthRequest {
  UserGuidId: string;
  BirthDate?: string; // ISO 8601 format
  AgeNumber?: number;
}

export interface DateOptionsModel {
  value: string;
  label: string;
}
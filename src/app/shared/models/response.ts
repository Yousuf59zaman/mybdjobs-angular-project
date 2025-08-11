import { ResponseCode, ResponseType } from '../enums/app.enums';

export interface ApiResponse<T> {
  responseType?: ResponseType;
  dataContext?: null | DataContext;
  responseCode?: ResponseCode;
  requestedData?: null;
  data?: T;
}

export interface DataContext {
  errorCode: number;
  name: string;
  invalidValue: string;
  message: string;
}

export interface ApiResponseOld {
  Error: string;
  Message: string;
}

export interface IResponse extends ApiResponse<any> {
  Error: string;
  Message: string;
}

export interface GenericApiResponse<T> {
  event: {
    eventType: number;
    eventData: EventDataResponse<T>[];
    eventId: number;
  }
}

export interface EventDataResponse<T> {
  key: string;
  value: T
}

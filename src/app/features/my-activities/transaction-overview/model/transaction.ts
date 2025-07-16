export interface Transaction {
  date: string;
  paymentMethod: string;
  serviceName: string;
  amount: number;
  totalFound: number;
}

export interface EventData {
  key: string;
  value: Transaction[];
}

export interface TransactionResponse {
  event:{
    eventType: number;
  eventData: EventData[];
  eventId: number;
  }
  
}

export interface TransactionRequest {
  fromDate: string;
  toDate: string;
  featureStatus: number;
  UserGuid: string;
  currentPage: number;
  noOfRecordsPerPage: number;
}
export interface Cvmail {

    companyName: string;
    myName: string;
    myEmail: string;
}


export interface GetUserEmailResponse {
    name: string;
    email: string;
  }
  export interface ApiResponse {
    eventType: number;
    eventData: Array<{
      key: string;
      value: GetUserEmailResponse[];
    }>;
    eventId: number;
  }
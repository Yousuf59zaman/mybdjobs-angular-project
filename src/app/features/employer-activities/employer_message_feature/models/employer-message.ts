export interface EmployerMessage {
  jobId: number;
  companyId: number;
  companyName: string;
  companyLogo: string;
  jobTitle: string;
  lastChattedOn: string;
  isRead: boolean;
  unreadMessage: number;
  formData: any;
  conversationId: string;
  lastMessage: string;
}

export interface EventData {
  key: string;
  value: EmployerMessage[];
}

export interface ApiResponse {
  event: {
    eventType: number;
    eventData: EventData[];
    eventId: number;
  };
}
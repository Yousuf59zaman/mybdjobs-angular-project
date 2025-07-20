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

export interface ChatMessage {
  textId: number;
  text: string;
  textSenderType: string;
  cnvId: number;
  textReadDate: string;
  textReadTime: string;
  textSendDate: string;
  textSendTime: string;
  employeeEmail: string;
  personalEmail: string | null;
  textSendBy: string | null;
}

export interface ChatEventData {
  key: string;
  value: any;
}

export interface GetMessagesResponse {
  eventType: number;
  eventData: ChatEventData[];
  eventId: number;
}
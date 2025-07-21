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

export interface EmployerInfo {
  messageId: number;
  companyName: string;
  jobTitle: string;
  fullName: string;
  photoLink: string;
  isBlockChat: boolean;
}

// Using discriminated union to properly type the different data structures
export interface ChatMessageEventData {
  key: "Chat Message ";
  value: ChatMessage[];
}

export interface EmployerInfoEventData {
  key: "EmployerInterestListCommon info ";
  value: EmployerInfo;
}

// Union type that can represent either kind of event data
export type ChatEventData = ChatMessageEventData | EmployerInfoEventData;

export interface GetMessagesResponse {
  eventType: number;
  eventData: ChatEventData[];
  eventId: number;
}
export interface Conversation {
    jobName: string;
    companyName: string;
    lastMessageDate: string;
    avatarUrl: string;
  }
  
 export interface Message {
    fromApplicant: boolean;
    text: string;
    time: string;
    date?: string;
    seen?: boolean;
    image?: string;
  }
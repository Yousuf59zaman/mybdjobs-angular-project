export interface EducationDetails {
  event: EducationEvent;
}

export interface EducationEvent {
  eventType: number;
  eventData: EventData[];
  eventId: number;
}

export interface EventData {
  key: string;
  value: MessageValue;
}

export interface MessageValue {
  eduLevels: EducationLevel[];
  educationDegrees: EducationDegree[];
  boardNames: BoardName[];
}

export interface EducationLevel {
  eduLevel: string;
  e_Code: number;
}

export interface EducationDegree {
  degreeName: string;
  eduLevel: string;
  educationType: number;
}

export interface BoardName {
  boardName: string;
  boardNameBng: string | null;
  boardId: number;
}
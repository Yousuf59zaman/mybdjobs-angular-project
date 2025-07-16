export interface AnswerOption {
  id: string;
  name: string;
  label: string;
}

export interface Question {
  text: string;
  name: string;
  value: string;
  answerKey: string;
}
export interface ApiResponse {
  eventType: number;
  eventData: { key: string;};
  eventId: number;
}
export interface PostForm {
  userGuidId: string;
  seenProblemDtId: number;
  seenProblem: string;
  hearProblemDtId: number;
  hearProblem: string;
  sswcProblemDtId: number;
  sswcProblem: string;
  concProblemDtId: number;
  concProblem: string;
  commProblemDtId: number;
  commProblem: string;
  tCareProblemDtId: number;
  tCareProblem: string;
  disabilityId: string;
}

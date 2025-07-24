export interface EducationSavePayload {
  userGuid: string,
  education: string, //degree
  institute: string,
  subject: string,
  passingYear: number,
  courseDuration: string,
  eduLevel: number,
  isForeignInstitute: boolean,
  result: number,
  percent_Mark: number
  grade_Scale: number
  achievement: string,
  isSummaryView: boolean,
  boardId: number,
  foreignCountry: string,
  educationType:number,
  educationId: number,
}
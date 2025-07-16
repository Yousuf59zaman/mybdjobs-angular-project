import { FormControl } from '@angular/forms';

export interface Education {
  UserId: FormControl<number | null>;
  HasEducation: FormControl<boolean | null>;
  EducationLevel: FormControl<number | null>;
  InstituteName: FormControl<string | null>;
  PassingYear: FormControl<number | null>;
  ExamTitle: FormControl<string | null>;
  BoardId: FormControl<number | null>;
  MajorGroup: FormControl<string | null>;
  EducationType: FormControl<number | null>;
}
export interface SelectItem {
  label: string;
  value: any;
  isSelected?: boolean;
  selectId?: string;
  mainObj?: any;
  icon?: string;
  count?: number;
}

export interface GetEduLevelInfoResponse {
  eduLevel: string | null;
  e_Code: number;
}

export interface GetDegreeNameResponse {
  degreeName: string | null;
  eduLevel: string | null;
  educationType : number;
}

export interface GetBoardNameResponse {
  boardName: string | null;
  boardNameBng: string | null;
  boardId : number;
}

export interface GetBoardNames {
  eduLevels: GetEduLevelInfoResponse[];
  educationDegrees: GetDegreeNameResponse[];
  boardNames: GetBoardNameResponse[];
}

export interface GetBoardNameAPIResponse<T> {
  event: {
    eventType: number;
    eventData: {
      key: string;
      value: T;
    }[]
    eventId: number;
  }
}

export interface InstituteResponse {
  locationResponse: [] | null;
  orgTypeResponse: [] | null;
  majorSubjectResponse: [] | null;
  instituteResponse: Institute[];
  companyProfileResponse: [] | null;
  dataFieldValueResponse: [] | null;
  skillResponse: [] | null;
}

export interface Institute {
  instituteID: string;
  instituteName: string;
}

export interface InstituteSearchPayload {
  condition: string;
  banglaField: string;
  con1: string;       // This is the exam title value (e.g. "-3")
  examTitle: string;  // The text of the exam title, e.g. "PSC"
  langType: string;
  param: string;      // Always "5"
  strData: string;    // The characters typed for the institute name
}

export interface EducationPost {
  userGuidId: string;
  hasEducation: boolean;
  educationLevel: number;
  instituteName: string;
  passingYear: number;
  examTitle: string;
  boardId: number;
  majorGroup: string;
  educationType: number;
}


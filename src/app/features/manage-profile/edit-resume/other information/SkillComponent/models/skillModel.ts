export interface SkillApiResponse {
  event: {
    eventType: number;
    eventData: Array<{
      key: string;
      value: Skill[];
    }>;
    eventId: number;
  };
}

export interface Skill {
  skillName: string;
  skillName_Bng: string;
  skillId: number;
  primarySkillId: number;
  ntvqf: string | null;
  skillLearnedBy: string[];
  extracurricular_Activities: string | null;
  skill_Description: string | null;
}

// Model for our component to use
export interface UISkill {
  skillId: number; 
  skillName: string;
  learnedMethods: string[];
  ntqfLevel?: string;
  description?: string;
  primarySkillId: number;
}
export interface UpdateDescriptionRequest {
  userGuid: string;
  skill_Description: string;
  extraCurricular_Activities: string;
  isSkillDes: boolean;
}

export interface UpdateDescriptionResponse {
  eventType: number;
  eventData: { key: string; value: number }[];
  eventId: number;
}

export interface SkillSuggestionResponse {
  event: {
    eventType: number;
    eventData: {
      key: string;
      value: SkillSuggestionValueItem[];
    }[];
    eventId: number;
  };
}

export interface SkillSuggestionValueItem {
  locationResponse: any | null;
  orgTypeResponse: any | null;
  majorSubjectResponse: any | null;
  instituteResponse: any | null;
  companyProfileResponse: any | null;
  dataFieldValueResponse: any | null;
  skillResponse: SkillResponseItem[] | null;
}

export interface SkillResponseItem {
  skillID: string;
  skillName: string;
}
export interface SkillPayload {
  userGuid: string;
  skill_Id: number;
  skilled_By: number[];
  ntvqf: string;
}
export interface DeleteSkillPayload {
  userGuid: string;
  skillId: number;
}

export interface UpdateSkillPayload{
  userGuid: string;
  primarySkillId: number;
  skillId : number;
  skilledBy: string;
  ntvqfLevel : string;
}
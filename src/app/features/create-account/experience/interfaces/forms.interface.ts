import { FormArray, FormControl } from '@angular/forms';

export interface experience {
    // examId: FormControl<number | null>,
    // examType: FormControl<string | null>,

    // optionsArr: FormArray
  }
  export interface SelectWorkingSkills {
    value: number;
    label: string;
  }
  export interface SkillResponse{
        eventType: number;
        eventData: { key: string; value: SelectWorkingSkills[] }[];
        eventId: number;
  }

  export interface SkillCategoryListResponse {
    isSuccess?: boolean;
    message?: string;
    skillCategories: SkillCategory[];
  }
  
  export interface SkillCategory {
    categoryId: number;
    catName: string;
    catNameBangla: string;
    specificSkillCategories: SpecificSkillCategory[] | null;
  }
  
  export interface SpecificSkillCategory {
    skillID: number;
    skillName_bng: string;
    skillName: string;
  }
  

export interface LearnSkill {
  selfId?: number;
  jobId?: number;
  educationalId?: number;
  professional_TrainingId?: number;
}

export interface SkillDataEntity {
  skillId?: string;
  skillName?: string;
  ntvqfLevel?: number;
  skillGuid?: string | null;
  skilledBy?: LearnSkill[];
}

export interface ExperienceRequestDataEntity {
  companyName?: string| null;
  designation?: string | null;
  startingDate?: string | null;       
  endingDate?: string | null;         
  stillContinuing?: boolean;
}

export interface SpecificSkillCategoryCommand {
  userGuidId: string;
  categoryId: number;
  skills?: SkillDataEntity[];
  hasExperience: boolean;
  experienceRequestDataEntitys?: ExperienceRequestDataEntity;
  p_UserGuid?: string | null;
  tottalExperience?: number;
  isFromFair?: boolean;
}

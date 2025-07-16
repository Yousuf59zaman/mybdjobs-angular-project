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

export interface SelectWorkingSkills {
  value: number;
  label: string;
} 
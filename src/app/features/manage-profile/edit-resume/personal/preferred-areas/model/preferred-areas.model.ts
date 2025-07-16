export interface PreferredAreaItem {
  categorie_Id: number;
  categorie_Name_English: string | null;
  categorie_Name_Bangla: string | null;
  location_Name: string | null;
  location_Id: number;
  organization_Name: string | null;
  organization_Type_Id: number;
}

export interface PreferredAreasApiResponse {
  event: {
    eventType: number;
    eventData: Array<{
      key: string;
      value: PreferredAreaItem[];
    }>;
    eventId: number;
  };
}

export interface SpecificSkillCategory {
  skillID: number;
  skillName_bng: string;
  skillName: string;
}

export interface SkillCategory {
  categoryId: number;
  caT_NAME: string;
  caT_NAME_Bangla: string;
  specificSkillCategories: SpecificSkillCategory[] | null;
}

export interface GetSkillCategoryApiResponse {
  eventType: number;
  eventData: Array<{
    key: string;
    value: {
      isSuccess: boolean;
      message: string;
      skillCategories: SkillCategory[];
    };
  }>;
  eventId: number;
}

// Request model for autosuggestion
export interface PreferredAreaAutoSuggestionRequest {
  condition: string;
  banglaField: string;
  con1: string; // "0" for inside, "1" for outside
  examTitle: string;
  langType: string;
  param: string; // always "1" for location
  strData: string; // query string
}

// Location response model
export interface LocationResponse {
  locationID: string;
  locationName: string;
}

export interface OrganizationResponse {
  orG_TYPE_ID: string;
  orG_TYPE_NAME: string;
}

// API response for autosuggestion
export interface PreferredAreaAutoSuggestionApiResponse {
  event: {
    eventType: number;
    eventData: Array<{
      key: string;
      value:
        | Array<{
            locationResponse?: LocationResponse[] | null;
            orgTypeResponse?: OrganizationResponse[] | null;
            majorSubjectResponse?: any;
            instituteResponse?: any;
            companyProfileResponse?: any;
            dataFieldValueResponse?: any;
            skillResponse?: any;
          }>
        | string; // For "Do Not Found Any Data"
    }>;
    eventId: number;
  };
}

// Model for mapped preferred areas state
export interface PreferredAreasMapped {
  functionalCategories: { id: number; name: string }[];
  specialSkilledCategories: { id: number; name: string }[];
  insideLocations: { id: number; name: string }[];
  outsideLocations: { id: number; name: string }[];
  organizations: { id: number; name: string }[];
}

// Model-driven mapping function
export function mapPreferredAreasResponse(apiResponse: any): PreferredAreasMapped {
  // Defensive: check structure
  const event = apiResponse?.event;
  const dataObj = event?.eventData?.find((d: any) => d.key === 'message');
  const value = dataObj?.value as any;
  const mapped: PreferredAreasMapped = {
    functionalCategories: [],
    specialSkilledCategories: [],
    insideLocations: [],
    outsideLocations: [],
    organizations: []
  };
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    // Categories
    (value.category || []).forEach((cat: any) => {
      if (cat.categorie_Id >= 1 && cat.categorie_Id <= 29) {
        mapped.functionalCategories.push({ id: cat.categorie_Id, name: cat.categorie_Name_English });
      } else if ((cat.categorie_Id >= 61 && cat.categorie_Id <= 92) || cat.categorie_Id === -11) {
        mapped.specialSkilledCategories.push({ id: cat.categorie_Id, name: cat.categorie_Name_English });
      }
    });
    // Locations
    (value.location || []).forEach((loc: any) => {
      if ((loc.location_Id >= 1 && loc.location_Id <= 64) || loc.location_Id === -1) {
        mapped.insideLocations.push({ id: loc.location_Id, name: loc.location_Name });
      } else if (loc.location_Id >= 101 && loc.location_Id <= 327) {
        mapped.outsideLocations.push({ id: loc.location_Id, name: loc.location_Name });
      }
    });
    // Organizations
    mapped.organizations = (value.organization || []).map((org: any) => ({
      id: org.organization_Id,
      name: org.organization_Name
    }));
  }
  return mapped;
}

import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { SelectWorkingSkills, SkillCategoryListResponse, SkillResponse, SpecificSkillCategoryCommand } from "../interfaces/forms.interface";

@Injectable({
    providedIn: 'root'
})
  
export class ExperienceService {

  private readonly getCategoryApiUrl = 'https://accountsubsystem-52061700766.asia-southeast1.run.app/api/CreateAccount/GetSkillCategory';
  private readonly postApiUrl = 'https://accountsubsystem-52061700766.asia-southeast1.run.app/api/CreateAccount/AddSkillExperience';



  constructor(private http: HttpClient) {}
  getSkillCategories(payload: { callerTypeId: number; languageType: string; specificCategorySkill?: string }): Observable<SkillCategoryListResponse> {
    let params = new HttpParams()
      .set('CallerTypeId', payload.callerTypeId.toString())
      .set('LanguageType', payload.languageType);

    if (payload.specificCategorySkill) {
      params = params.set('SpecificCategorySkill', payload.specificCategorySkill);
    }

    return this.http.get<any>(this.getCategoryApiUrl, { params }).pipe(
      map(response => {
        if (response.eventData && response.eventData.length > 0) {
          const successEvent = response.eventData.find((event: any) => event.key === 'Success');
          if (successEvent && successEvent.value) {
            const value = successEvent.value;
            value.skillCategories = value.skillCategories.map((cat: any) => ({
              categoryId: cat.categoryId,
              catName: cat.caT_NAME,
              catNameBangla: cat.caT_NAME_Bangla,
              specificSkillCategories: cat.specificSkillCategories
            }));
            return value;
          }
        }
        return { isSuccess: false, message: 'No data', skillCategories: [] };
      })
    );
  }
  
  createExperience(command: SpecificSkillCategoryCommand): Observable<any> {
    return this.http.post<any>(this.postApiUrl, command);
  }
}
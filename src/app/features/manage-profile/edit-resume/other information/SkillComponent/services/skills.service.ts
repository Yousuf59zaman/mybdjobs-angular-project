// services/skill.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  SkillApiResponse,
  Skill,
  UISkill,
  UpdateDescriptionRequest,
  UpdateDescriptionResponse,
  SkillResponseItem,
  SkillSuggestionResponse,
  SkillPayload,
  DeleteSkillPayload,
  UpdateSkillPayload,
} from '../models/skillModel';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private apiUrl =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetSkill';
  private postDescriptionUrl =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/UpdateDescriptionAndExtraActivity';
  private autoSuggestionUrl =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/AutoSuggestion';
  private insertSkillUrl =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/InsertSkill';
  private deleteSkillUrl =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/DeleteSkill'
  private updateSkillUrl =
    'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/UpdateSkill'
  constructor(private http: HttpClient) {}

  getSkills(userGuid: string): Observable<UISkill[]> {
    const params = new HttpParams().set('UserGuid', userGuid);
    return this.http.get<SkillApiResponse>(this.apiUrl, { params }).pipe(
      map((response) => {
        const skills =
          response.event.eventData.find((d) => d.key === 'message')?.value ||
          [];
        return this.mapToUISkills(skills);
      })
    );
  }

  private mapToUISkills(skills: Skill[]): UISkill[] {
    return skills.map((skill) => ({
      skillName: skill.skillName,
      learnedMethods: this.mapLearnedMethods(skill.skillLearnedBy),
      ntqfLevel: skill.ntvqf || undefined,
      description: skill.skill_Description || undefined,
      skillId: skill.skillId,
      primarySkillId: skill.primarySkillId
    }));
  }

  private mapLearnedMethods(methods: string[]): string[] {
    // Map your numeric codes to method names
    const methodMap: { [key: string]: string } = {
      '1': 'Self',
      '2': 'Job',
      '3': 'Educational',
      '4': 'Professional Training',
      '5': 'NTVQF',
    };

    return methods.map((m) => methodMap[m] || m);
  }

  updateDescription(
    payload: UpdateDescriptionRequest
  ): Observable<UpdateDescriptionResponse[]> {
    return this.http.post<UpdateDescriptionResponse[]>(
      this.postDescriptionUrl,
      payload
    );
  }

  getSkillSuggestions(query: string): Observable<SkillResponseItem[]> {
    const payload = {
      condition: '',
      banglaField: '',
      con1: '',
      examTitle: '',
      langType: '',
      param: '4', // Always 4 as per your requirement
      strData: query,
    };

    return this.http
      .post<SkillSuggestionResponse>(this.autoSuggestionUrl, payload)
      .pipe(
        map((response) => {
          const allSkills: SkillResponseItem[] = [];
          response.event.eventData.forEach((dataItem) => {
            if (dataItem.key === 'message') {
              dataItem.value.forEach((valueItem) => {
                if (valueItem.skillResponse) {
                  allSkills.push(...valueItem.skillResponse);
                }
              });
            }
          });
          return allSkills;
        })
      );
  }

  addSkill(payload: SkillPayload): Observable<any> {
    return this.http.post(this.insertSkillUrl, payload);
  }
  deleteSkill(payload: DeleteSkillPayload) {
    return this.http.delete<any>(this.deleteSkillUrl, {body:payload});
  }
  updateSkill(payload: UpdateSkillPayload){
    return this.http.post<any>(this.updateSkillUrl , payload);
  }
}

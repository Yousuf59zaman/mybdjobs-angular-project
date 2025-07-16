import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PreferredAreasApiResponse, GetSkillCategoryApiResponse, PreferredAreaAutoSuggestionRequest, PreferredAreaAutoSuggestionApiResponse, LocationResponse, OrganizationResponse } from '../model/preferred-areas.model';

@Injectable({ providedIn: 'root' })
export class PreferredAreasService {
  private getPreferredAreasApiUrl = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/GetPrefferedAreas';
  private getSkillCategoryApiUrl = 'https://accountsubsystem-odcx6humqq-as.a.run.app/api/CreateAccount/GetSkillCategory';
  private autoSuggestionApiUrl = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/AutoSuggestion';

  constructor(private http: HttpClient) {}

  getPreferredAreas(userGuid: string, language: string): Observable<PreferredAreasApiResponse> {
    const params = new HttpParams()
      .set('UserGuid', userGuid)
      .set('language', language);
    return this.http.get<PreferredAreasApiResponse>(this.getPreferredAreasApiUrl, { params });
  }

  getSkillCategories(callerTypeId: number, languageType: string, specificCategorySkill: string): Observable<GetSkillCategoryApiResponse> {
    const params = new HttpParams()
      .set('CallerTypeId', callerTypeId)
      .set('LanguageType', languageType)
      .set('SpecificCategorySkill',specificCategorySkill);
    return this.http.get<GetSkillCategoryApiResponse>(this.getSkillCategoryApiUrl, { params });
  }

  getAutoSuggestions(
    payload: PreferredAreaAutoSuggestionRequest
  ): Observable<{ locations: LocationResponse[]; organizations: OrganizationResponse[]; noDataMessage?: string }> {
    return this.http
      .post<PreferredAreaAutoSuggestionApiResponse>(this.autoSuggestionApiUrl, payload)
      .pipe(
        map((res) => {
          let locations: LocationResponse[] = [];
          let organizations: OrganizationResponse[] = [];
          let noDataMessage: string | undefined;

          if (res?.event?.eventType === 1 && Array.isArray(res.event.eventData)) {
            const dataObj = res.event.eventData.find((d) => d.key === 'message');
            if (Array.isArray(dataObj?.value)) {
              dataObj.value.forEach((item: any) => {
                if (Array.isArray(item.locationResponse)) {
                  locations.push(...item.locationResponse);
                }
                if (Array.isArray(item.orgTypeResponse)) {
                  organizations.push(...item.orgTypeResponse);
                }
              });
            }
          }
          if (res?.event?.eventType === 2 && Array.isArray(res.event.eventData)) {
            const dataObj = res.event.eventData.find((d) => d.key === 'message');
            if (typeof dataObj?.value === 'string') {
              noDataMessage = dataObj.value;
            }
          }
          return { locations, organizations, noDataMessage };
        }),
        catchError(() => of({ locations: [], organizations: [], noDataMessage: 'Failed to fetch suggestions.' }))
      );
  }

  updatePreferredAreas(payload: {
    userGuid: string;
    whiteCategories: number[];
    totalWhiteCategories: number;
    blueCategories: number[];
    totalBlueCategories: number;
    districts: number[];
    totalDistricts: number;
    countries: number[];
    totalCountries: number;
    organizations: number[];
    totalOrganizations: number;
  }): Observable<any> {
    const url = 'https://jobseekerresumesubsystem-odcx6humqq-as.a.run.app/api/EditResume/UpdatePrefAreas';
    return this.http.post(url, payload);
  }
}

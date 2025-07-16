export interface GetEmailedResumeQuery {
    PageNo: number;
    UserGuid: string;
    PageSize: number;
    LanType: string;
    FromDate?: string;
    SearchToDate?: string;
    SearchSubjectName?: string;
    cvType?: number | null;
}
export interface GetEmailedResumeResponse {
    id: string;
    UserGuid: string;
    jp_id: number;
    emailSubject: string;
    emailTo: string;
    attachment: string;
    jobLang: string | null;
    totalJob: number;
    emailedOn: string;
    sentOn: string;
}
export interface DeleteResume{
    id: string;
    UserGuid: string;
}
export interface EmailResponse {
    eventType: number;
    eventData: { key: string; value: GetEmailedResumeResponse[] }[];
    eventId: number;
}
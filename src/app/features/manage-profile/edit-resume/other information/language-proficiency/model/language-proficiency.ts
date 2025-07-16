export interface LanguageQuery{
    UserGuid: string;
}

export interface LanguageResponse{
    languageId: number,
    languageName:string,
    readingLevel:string,
    writingLevel:string,
    speakingLevel:string,
}

export interface EventData {
 key: string;
 value: LanguageResponse[];
}

export interface LanguagePayload {
 eventType: number;
 eventData: EventData[];
 eventId: number;
}


export interface LanguageInfoResponse {
 event: LanguagePayload;
}

export interface updateLanguage{
  userGuid: string,
  languageID: number,
  languageName: string,
  languageReading: string,
  languageWriting: string,
  languageSpeaking: string,
}

export interface insertLanguage{
    userGuid: string,
    languageName: string,
    languageReading: string,
    languageWriting: string,
    languageSpeaking: string
}

export interface deleteLanguage{
  l_ID: number,
  userGuid: string
}
export interface TrainingInfoQuery {
 UserGuid: string;
}


export interface TrainingSummary {
 t_ID: number;
 trainingTitle: string;
 location: string;
 country: string;
 institute: string;
 topicsCovered: string;
 duration: string;
 trainingYear: number;
}


export interface EventData {
 key: string;
 value: TrainingSummary[];
}


export interface TrainingInfoPayload {
 eventType: number;
 eventData: EventData[];
 eventId: number;
}


export interface TrainingInfoResponse {
 event: TrainingInfoPayload;
}


export interface InsertTrainingInfoCommand {
 t_ID: number;
 trainingTitle: string;
 country: string;
 topicsCovered: string;
 trainingYear: number;
 institute: string;
 duration: string;
 location: string;
 userGuid: string;
}
export interface UpdateTrainingInfoCommand {
 trainingId: number;
 trainingTitle: string;
 country: string;
 topicsCovered: string;
 trainingYear: number;
 institute: string;
 duration: string;
 location: string;
 userGuid: string;
}

export interface DeleteTrainingInfo {
  userGuid: string,
  trainingID: number
}
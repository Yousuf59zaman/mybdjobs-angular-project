

export interface DashboardInfoPayload {
  userGuid: string;
  numberOfDays: number;
}

export interface DashboardStatsPayload {
  userGuid: string;
  dateGroupingOption: number;
}

export interface DashboardInfoResponse {
  totalFavouriteSearch: number;
  totalSavedJobs: number;
  totalFollowingEmployers: number;
  totalBdjobsProfileView: number;
  totalVideoCvViewed: number;
  totalCustomizedCvViewed: number;
  totalOnlineTest: number;
  totalVideoInterview: number;
  totalGeneralInterview: number;
  totalPersonalityTest: number;
  totalSavedJobsPrevious: number;
  totalFollowingEmployersPrevious: number;
  totalFavouriteSearchPrevious: number;
  emailedBdjobsResume: number;
  emailedPersonalResume: number;
  totalEmailedResume: number;
  downloadedPersonalResume: number;
  downloadedBdjobsResume: number;
  totalDownloadedResume: number;
}

export interface DashboardStatsResponse {
  dateOfApplied: string;
  numberOfJobApplied: number;
}

export interface PlanPointResponse {
  packageName: string | null;
  packageStartDate: string | null;
  packageEndDate: string;
  packageDuration: number | null;
  packageId: number | null;
  totalPoints: number;
  totalPurchased: number;
  totalSent: number;
  totalLeft: number;
}

export interface InvitationResponse {
  onlineTest: number;
  videoInterview: number;
  generalInterview: number;
  personalityTestByVoice: number;
}

export interface DashboardPersonalInfoResponse {
  planAndPointsResponse: PlanPointResponse;
  interViewInvitationResponse: InvitationResponse;
}

export interface DashboardRightPanelData {
  fileResponse: CustomizedCVResponse;
  resumeResponse: ProfileResumeResponse;
  videoQuestionResponse: VideoQuestionResponse;
  videoResumeResponse: VideoResumeResponse[];
}

export interface CustomizedCVResponse {
  fileType: string;
  path_doc: string;
  updatedOn: string;
  firstName: string;
  lastName: string;
}

export interface ProfileResumeResponse {
  skillDescription: string | null;
  photoUploaded: number;
  academicQualification: number;
  training: number;
  professionalQualification: number;
  experience: number;
  specialization: number;
  languagePreference: number;
  refference: number;
  updatedOn: string,
  isCVposted: number;
}
export interface VideoQuestionResponse {
  videoResumeTotalAnswerQuestion: number;
}

export interface VideoResumeResponse {
  questionId: number
  questionSerialNo: number;
  questionText: string,
  duration: number;
  isQuesActivated: 0 | 1;
  aId: number | null;
  sourcePath: string | null;
  totalAttempts: number | null;
  totalViewed: number | null;
  postedOn: string | null;
  questionTextBangla: string;
}

export interface ProStatInfo {
  totalUsed: number;
  packageStartDate: string;
  packageEndDate: string;
  packageDuration: number;
  packageName: string;
  packageId: number;
  featureName: string;
  featureId: number
  featureQuantity: number;
  earlyAccessJobs: number;
}

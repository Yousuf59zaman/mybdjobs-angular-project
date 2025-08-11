import { Type } from '@angular/core';
import { IStaticMethods } from 'preline/preline';

declare global {
  export interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

export interface SelectItem {
  label: string;
  value: any;
  isSelected?: boolean;
  selectId?: string;
  mainObj?: any;
  icon?: string;
  count?: number;
}

export interface selectBoxItem {
  label: string;
  value: any;
  id?: string;
  isSelected?: boolean;
  selectId?: string;
  mainObj?: any;
  icon?: string;
  count?: number;
}

export interface MultiSelectQueryEvent {
  originalEvent?: Event;
  query: string;
}

export interface BaseObject {
  id: number;
  name: string;
}

export interface Locality extends BaseObject {
  isOutsideBangladesh: number;
  parentLocationId: number;
}

export type ActiveFiltersBadges = {
  controlType: string;
  value: any;
  isActive: boolean;
};

export interface SelectRadioData {
  id: number | string | boolean;
  name: string;
  label: string;
}

export interface Pagination {
  pageNo: number;
  pageSize: number;
  total?: number;
}

export interface CustomSelectData {
  venueId: string;
  vanueName: string;
  venueAddress: string;
}

export interface Venue {
  venueID: number;
  venueName: string;
  venueAddress: string;
}

export interface VenueParams {
  companyID: number;
  userID: number;
}

export interface VanueEditUpdateRequest {
  companyId: string;
  userId: string;
  venueName: string;
  venueAddress: string;
  venueId: number;
}
export interface ModalConfig {
  attributes: Record<string, string | boolean>;
  componentRef: Type<any>;
  inputs?: Record<string, any>;
  isClose?: boolean;
  callbacks?: { [key: string]: (...args: any[]) => void };
}

export interface TrainingSummary {
  id: number;
  title: string;
  country: string;
  topics: string;
  year: string;
  institute: string;
  duration: string;
  location: string;
}

export interface VideoCvStep {
  number: number;
  title: string;
  timeInSeconds: number;
  isActive: boolean;
  isCompleted?: boolean;
  videoUrl: string | null; // This can be either string or null
}

export interface GuidelineItem {
  text: string;
}

export interface FileUploadProps {
  header?: {
    title?: string;
    helpIconSrc?: string;
    helpText?: string;
  };
  uploadArea?: {
    uploadIconSrc?: string;
    description?: string;
    buttonText?: string;
  };
  guidelines?: {
    iconSrc?: string;
    title?: string;
    guidelines?: GuidelineItem[];
  };
}

export interface Message {
  id: string;
  avatar: string;
  name: string;
  message: string;
  timeIcon: string;
  timeText: string;
  unreadCount: number;
  isRead: boolean;
  mayMessage: boolean;
  hasBorder?: boolean;
  isSelected?: boolean;
  receivedMessages?: Array<{
    text: string;
    time: string;
    date?: string;
  }>;
}

export type JobStatusType =
  | 'pending'
  | 'contacted'
  | 'offered'
  | 'joined'
  | 'not-joined'
  | 'not-contacted'
  | 'not-contacted-temp'
  | 'not-offered'
  | 'not-offered-temp'
  | 'not-joined-hidden'
  | 'rejected';

export type RecruitmentStatus =
  | 'Applied'
  | 'Shortlisted'
  | 'Interviewed'
  | 'Offered'
  | 'Hired'
  | 'Rejected'
  | '';

export interface JobCardData {
  id: string;
  title: string;
  company: string;
  hideStatusBadge?: boolean;
  bdjobsPro?: BdjobsPro;
  appliedDate: string;
  conversationId: string;
  companyId: number;
  jobId: number;
  companyName: string;
  lastChattedOn?: string;
  lastMessage?: string;
  unreadMessage?: number;
  isRead?: boolean;
  companyLogo?: string;
  salary: string;
  needleAngle: number;
  minSalary?: number;
  maxSalary?: number;
  pendingIcon: string;
  hasInsight: boolean;
  isInsightBlurred: boolean;
  reasonId: number;
  status?: string;
  statusType?: JobStatusType;
  insightUnlocked?: boolean;
  profileViewIcon?: string;
  profileViewText?: string;
  matchPercentage?: number;
  matchIcon?: string;
  recruitmentStatus?: RecruitmentStatus;
  statusMessage?: string;
  insightExpanded?: boolean;
  hasProgressImage?: boolean;
  progressImageExpanded?: boolean;
  progressPercentage?: string;
  progressImageUrl?: string;
  showActionButtons?: boolean;
  isBoosted?: number;
  profileMatched?: number;
  totalApplicant?: number;
  totalShortlisted?: number;
  totalViewed?: number;
  isVideoResumeRequired?: boolean;
  isCustomResumeRequired?: boolean;

  deadLine: string;

  isFairJob: boolean;
  isLinkedInApply: boolean;
  contactStatus?: 'contacted' | 'not-contacted' | null;
  offerStatus?: 'offered' | 'not-offered' | null;
  showContactButtons?: boolean;
  showOfferButtons?: boolean;
  viewedByEmployer?: string; // Changed from boolean to string
  isCancelled?: number;
  messageInitiate?: number;
  isDetailedViewed?: number;
  matchingScore?: number;
  positionStatus?: number;
  topApplicantMatchingPercentage?: number;
  totalApplicants?: number;
  totalCVViewed?: number;
  isBlockCp?: boolean;
  restrictedServiceName?: string | null;
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  showPrevious?: boolean;
  showNext?: boolean;
  maxVisiblePages?: number;
}

export interface PaginationEvent {
  type: 'previous' | 'next' | 'page';
  page?: number;
}

export interface ChatMessage {
  textId: number;
  text: string;
  textSenderType: 'A' | 'R'; // 'A' for Applicant, 'R' for Recruiter
  cnvId: number;
  textReadDate: string;
  textReadTime: string;
  textSendDate: string;
  textSendTime: string;
  employeeEmail?: string;
  personalEmail?: string | null;
  textSendBy?: string | null;
  status?: 'sent' | 'delivered' | 'read' | 'sending' | 'failed';
}

export interface GetCareerInfoQuery {
  UserGuid: string;
  IsBdjobsPro?: boolean;
  FromDate?: string;
  ToDate?: string;
  CompanyName?: string;
  SelectValue?: string;
  PageNumber?: number;
  Version?: string;
  LastDate?: boolean;
  NoOfRecordPerPage?: number;
}

export interface Activity {
  totalNotContacted: number;
  totalContacted: number;
  totalHired: number;
  totalOffered: number;
  hasAnyHighPriority: number;
}

export interface CareerInfoResponse {
  event: {
    eventType: number;
    eventData: {
      key: string;
      value: {
        common: {
          tottalNumberOfJob: number;
          showMessage: number;
          totalNumberOfPage: number;
        };
        activity: Activity[];
        data: {
          langType: number;
          jobId: number;
          deadLine: string;
          sl: number;
          companyName: string;
          title: string;
          appliedOn: string;
          expectedSalary: number;
          minSalary: number;
          maxSalary: number;
          status: string;
          viewedByEmployer: string;
          invitaion: number;
          isUserSeenInvitation: number;
          priority: number;
          profileMatched: number;
          topPosition: number;
          totalApplicant: number;
          isCustomResumeRequired: number;
          isVideoResumeRequired: number;
          recruitmentStatus: string;
          reasonId: number;
          jobStatusId: string | null;
          messageInitiate: number;
          isCancleApply: number;
          unreadMessageCount: number;
          applyId: number;
          isBoosted: number;
          isShortlistProcessStart: number;
          isDetailedViewed: number;
          topApplicantMatchingPercentage: number;
          basicMatchingPercentage: number;
          totalViewed: number;
          totalShortlisted: number;
        }[];
      };
    }[];
    eventId: number;
  };
}

export interface GetCareerInfoQuery {
  UserGuid: string;
}

export interface CareerInfoPayload {
  eventType: number;
  eventData: EventData[];
  eventId: number;
}

export interface CareerInfoResponseCookies {
  event: CareerInfoPayload;
}

export interface EventData {
  key: string;
  value: CareerInfo;
}

export interface CareerInfo {
  obj: string;
  cur_Sal: number;
  exp_Sal: number;
  available: string;
  pref: string;
  bdjobsPro?: BdjobsPro;
}
export interface UpdateCareerInfo {
  userGuid: string;
  objective: string;
  present_Salary: number;
  expected_Salary: number;
  available: string;
  job_Level: string;
  isWebOrApp: number;
}

export interface JobBoosting {
  userGuid: string;
  jobId: number;
  packageId: number;
}

export interface ExperienceData {
  id: string;
  company: string;
  startDate: string;
  endDate: string;
  experience_ID: number;
  companyName: string;
  experienceFrom: string;
  experienceTo: string;
}

export interface FeedbackFormData {
  reason: string;
}

export interface RadioOption {
  id: string;
  label: string;
  value: string;
}

export interface GetCareerInfoQuery {
  UserGuid: string;
  Version?: string;
  FromDate?: string;
  ToDate?: string;
  CompanyName?: string;
  SelectValue?: string;
  PageNumber?: number;
  NoOfRecordPerPage?: number;
}

export interface ExperienceApiResponse {
  event: {
    eventType: number;
    eventData: Array<{
      key: string;
      value: RawExperienceData[];
    }>;
    eventId: number;
  };
}

export interface RawExperienceData {
  experience_ID: number;
  companyId: number;
  companyName: string;
  businessType: string;
  experiencePosition: string;
  deptartment: string;
  companyLocation: string;
  experienceFrom: string;
  experienceTo: string | null;
  serve_Till: string;
  jobId: number;
  skillId: number;
  skillName: string;
  durationOfExperience: string;
}

export interface ExperienceData {
  id: string;
  company: string;
  position: string;
  department: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  duration: string;
  businessType: string;
  skills: string[];
  experience_ID: number;
  companyId: number;
}

export interface UpadteExistAppliedJob {
  userGuid: string;
  jobId: number;
  experienceId: number;
  status?: number;
  reasonId?: number;
  reasonPackage?: string;
  responseType: number;
}

export interface BdjobsPro {
  isProUser: boolean;
  packageName: string;
  packageStartDate: string;
  packageDuration: number;
  packageEnddate: string;
  applylimit: number;
  messageLimit: number;
}

export type TooltipTag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

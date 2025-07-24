import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  CareerInfoResponse,
  ChatMessage,
  ExperienceApiResponse,
  GetCareerInfoQuery,
  JobCardData,
  JobStatusType,
  PaginationConfig,
  PaginationEvent,
  RecruitmentStatus,
} from '../applied-jobs/models/appliedJobs.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CareerApplicationInfoServiceService } from './services/careerApplicationInfo.service';
import { debounceTime, distinctUntilChanged, finalize, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { DateRangePickerComponent } from '../../../shared/components/date-range-picker/date-range-picker.component';
import { AppliedJobsUndoApplicationModalComponent } from '../../../shared/components/applied-jobs-undo-application-modal/applied-jobs-undo-application-modal.component';
import { CircularLoaderService } from '../../../core/services/circularLoader/circular-loader.service';
import { CookieService } from '../../../core/services/cookie/cookie.service';
import { ModalService } from '../../../core/services/modal/modal.service';
import { AppliedjobsBoostApplicationForProComponent } from '../../../shared/components/appliedjobs-boost-application-for-pro/appliedjobs-boost-application-for-pro.component';
import { AppliedjobsBoostSuccessModalComponent } from '../../../shared/components/appliedjobs-boost-success-modal/appliedjobs-boost-success-modal.component';
import { AppiledJobsNotJoinedModalComponent } from '../../../shared/components/appiled-jobs-not-joined-modal/appiled-jobs-not-joined-modal.component';
import { AppliedJobsBoostingApplicationComponent } from '../../../shared/components/applied-jobs-boosting-application/applied-jobs-boosting-application.component';
import { AppliedJobsBoostApplicationNormalUserModalComponent } from '../../../shared/components/applied-jobs-boost-application-normal-user-modal/applied-jobs-boost-application-normal-user-modal.component';
import { AppiledJobsExperienceModalComponent } from '../../../shared/components/appiled-jobs-experience-modal/appiled-jobs-experience-modal.component';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-applied-jobs',
  imports: [
    CommonModule,
    FormsModule,
    DateRangePickerComponent,
    ReactiveFormsModule,
    AppliedJobsUndoApplicationModalComponent,
    TranslocoDirective,
  ],
  providers: [provideTranslocoScope('appliedJobs')],
  templateUrl: './applied-jobs.component.html',
  styleUrl: './applied-jobs.component.scss',
})
export class AppliedJobsComponent {
  totalJobsCount: number = 0;
  contactedCount: number = 0;
  offeredCount: number = 0;
  joinedCount: number = 0;
  itemsPerPage: number = 5;
  topPositionPercentage: number = 0;
  isTopApplicant: boolean = false;
  needleAngle: number = -84;
  showDropdown = false;
  selectedFilter: string = '';
  selectedJob: JobCardData | null = null;
  messageText: string = '';
  showMessagePopup: boolean = false;
  chatMessages: ChatMessage[] = [];
  remainingMessages: number = 3; // Initial value
  @ViewChild('datePickerContainer') datePickerContainer!: ElementRef;
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;
  @Output() pageChange = new EventEmitter<PaginationEvent>();
  paginatedJobs: JobCardData[] = [];
  appliedJobs: JobCardData[] = [];
  totalJobs = 0;
  currentPage = 1;
  totalPages = 0;
  showPicker = false;
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  dateRangeDisplay = '';
  selectedMessage: any;
  selectedOptionValue: number | null = null;
  companyNameFilter = new FormControl('');
  @Input() max: number = 3;
  @Input() sentMessageCounts: { [key: string]: number } = {};
  @Input() userImageUrl?: string;
  @Input() avatarSize: 'sm' | 'md' | 'lg' = 'md';
  @Input() helpTitle: string = 'How can we help you?';
  @Input() helpDescription: string =
    'We need a bit more info to connect you with the right customer support team.';
  @Input() inputPlaceholder: string = 'Write your message..';
  @Input() inputProgress: number = 3;
  @Input() inputDisabled: boolean = false;
  @Input() progressRingSize: number = 0;
  @Input() progressRingStrokeWidth: number = 2;
  @Output() minimize = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() sendMessage = new EventEmitter<string>();
  private circularLoaderService = inject(CircularLoaderService);
  private destroyRef = inject(DestroyRef);
  private readonly careerService = inject(CareerApplicationInfoServiceService);
  isInfoAvailable = false;
  companyNameControl = new FormControl('');
  companySuggestions: string[] = [];
  showSuggestions = false;
  isLoadingSuggestions = false;
  UserGuid: string | null = null;
  editingJobId: string | null = null;
  originalSalary: string | null = null;
  selectedOption: string = '';
  IsBdjobsPro: string = 'false';
  insightUnlocked: boolean = false;
  chatApiResponse: any;
  public isModalOpen = false;
  currentBoostJob: JobCardData | null = null;
  consecutiveACount: number = 0;
  disableSendButton: boolean = false;
  sentMessagesCount: number = 0;
  maxAllowedMessages: number = 3;
  message: any = {};
  @ViewChild('companyInput') companyInput!: ElementRef;
  @ViewChild('matchIconRef') matchIconRef!: ElementRef;
  @ViewChild('gaugeRef') gaugeRef!: ElementRef;
  @ViewChild('tooltipTarget', { static: false }) tooltipTarget!: ElementRef;
  showTooltip = false;
  tooltipTop = 0;
  tooltipLeft = 0;
  careerForm = new FormGroup({
    obj: new FormControl('', [Validators.required, Validators.pattern(/\S/)]),
    cur_Sal: new FormControl('', [Validators.pattern('^[0-9]{1,9}$')]),
    exp_Sal: new FormControl('', [Validators.pattern('^[0-9]{1,10}$')]),
    available: new FormControl(''),
    pref: new FormControl(''),
  });
  filterSections = [
    {
      title: 'appliedJobs.appliedJobs.filters.employersActions.title',
      sectionName: 'employers-actions',
      options: [
        {
          id: 'viewed',
          label: 'appliedJobs.appliedJobs.filters.employersActions.viewed',
          checked: false,
          value: 1,
        },
        {
          id: 'not-viewed',
          label: 'appliedJobs.appliedJobs.filters.employersActions.notViewed',
          checked: false,
          value: 2,
        },
      ],
    },
    {
      title: 'appliedJobs.appliedJobs.filters.pendingRequired.title',
      sectionName: 'pending-required',
      options: [
        {
          id: 'video-cv',
          label: 'appliedJobs.appliedJobs.filters.pendingRequired.videoCv',
          checked: false,
          value: 2,
        },
        {
          id: 'customized-cv',
          label: 'appliedJobs.appliedJobs.filters.pendingRequired.customizedCv',
          checked: false,
          value: 2,
        },
      ],
    },
    {
      title: 'appliedJobs.appliedJobs.filters.recruitmentStatus.title',
      sectionName: 'recruitment-status',
      options: [
        {
          id: 'interview-invitation',
          label:
            'appliedJobs.appliedJobs.filters.recruitmentStatus.interviewInvitation',
          checked: false,
          value: 6,
        },
        {
          id: 'joined',
          label: 'appliedJobs.appliedJobs.filters.recruitmentStatus.joined',
          checked: false,
          value: 3,
        },
        {
          id: 'offered',
          label: 'appliedJobs.appliedJobs.filters.recruitmentStatus.offered',
          checked: false,
          value: 4,
        },
        {
          id: 'contracted',
          label: 'appliedJobs.appliedJobs.filters.recruitmentStatus.contracted',
          checked: false,
          value: 5,
        },
      ],
    },
    {
      title: 'appliedJobs.appliedJobs.filters.priority.title',
      sectionName: 'priority',
      options: [
        {
          id: 'high',
          label: 'appliedJobs.appliedJobs.filters.priority.high',
          checked: false,
          value: 7,
        },
        {
          id: 'regular',
          label: 'appliedJobs.appliedJobs.filters.priority.regular',
          checked: false,
          value: 8,
        },
      ],
    },
    {
      title: 'appliedJobs.appliedJobs.filters.other.title',
      sectionName: 'other',
      options: [
        {
          id: 'other',
          label: 'appliedJobs.appliedJobs.filters.other.other',
          checked: false,
          value: 9,
        },
      ],
    },
  ];

  @Input() config: PaginationConfig = {
    currentPage: 1,
    totalPages: 0,
    showPrevious: true,
    showNext: true,
    maxVisiblePages: 5,
  };
  jobsData!: JobCardData[];

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadCareerInfoCookies();
    this.loadInitialData();
    this.setupCompanySuggestions();
  }

  private loadCareerInfoCookies(): void {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId');
    this.UserGuid = rawGuid ? decodeURIComponent(rawGuid) : null;
    this.IsBdjobsPro = this.cookieService.getCookie('IsBdjobsPro') || 'false';

    if (!this.UserGuid) {
      console.error('UserGuid not found in cookies');
      return;
    }

    const query: GetCareerInfoQuery = {
      UserGuid: this.UserGuid,
      IsBdjobsPro: this.IsBdjobsPro,
    };

    this.careerService.getCareerInfo(query).subscribe({
      next: (res) => {
        const payload = res.event;
        if (payload.eventData.length > 0 && payload.eventData[0].value) {
          const res = payload.eventData[0].value;
          this.isInfoAvailable = true;
          this.careerForm.patchValue({
            obj: res.obj || '',
            cur_Sal: res.cur_Sal?.toString() || '',
            exp_Sal: res.exp_Sal?.toString() || '',
            pref: res.pref || '',
            available: res.available || '',
          });
        } else {
          this.isInfoAvailable = false;
        }
      },
      error: (error) => {
        console.error('Error loading career info:', error);
        this.isInfoAvailable = false;
      },
    });
  }

  private loadInitialData() {
    if (!this.UserGuid) {
      console.error('UserGuid not available');
      return;
    }

    const initialQuery: GetCareerInfoQuery = {
      UserGuid: this.UserGuid,
      IsBdjobsPro: this.IsBdjobsPro,
      Version: 'EN',
      PageNumber: 1,
    };

    this.circularLoaderService.setLoading(true);

    this.careerService.getAppliedJobs(initialQuery).subscribe({
      next: (jobsResponse) => {
        this.processJobsResponse(jobsResponse);
        this.fetchInitialChatData();
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.circularLoaderService.setLoading(false);
      },
    });
  }

  private processJobsResponse(response: any) {
    if (response?.event?.eventData?.[0]?.value?.data) {
      this.appliedJobs = response.event.eventData[0].value.data.map(
        (job: any) => this.transformJobData(job)
      );
      this.totalJobsCount =
        response.event.eventData[0].value.common.tottalNumberOfJob;
      if (response.event.eventData[0].value.activity?.length) {
        const activity = response.event.eventData[0].value.activity[0];
        this.contactedCount = activity.totalContacted;
        this.offeredCount = activity.totalOffered;
        this.joinedCount = activity.totalHired;
      }
    }
    this.initializePagination();
  }

  private initializePagination(): void {
    this.totalPages = Math.ceil(this.appliedJobs.length / this.itemsPerPage);
    this.config.totalPages = this.totalPages;
    this.currentPage = 1;
    this.config.currentPage = 1;
    this.updatePaginatedJobs();
  }

  private updatePaginatedJobs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedJobs = this.appliedJobs.slice(startIndex, endIndex);
  }

  getProInsightPosition(job: any): string {
    if (job.hasProgressImage) {
      return 'bottom-[102px]';
    }
    return 'top-[115px]';
  }

  getFooterClasses(job: any): string {
    return job.statusMessage?.includes('Reason:') ? '' : 'leading-none';
  }

  getFooterContentClasses(job: any): string {
    return job.statusMessage?.includes('Reason:') ? 'max-md:max-w-full' : '';
  }

  getUndoButtonClasses(job: any): string {
    return job.statusMessage?.includes('Reason:') ? 'leading-none' : '';
  }

  unlockInsight(job: JobCardData) {
    job.insightUnlocked = true;
  }

  trackByJobId(index: number, job: JobCardData): string {
    return job.id;
  }

  toggleInsight(job: JobCardData) {
    job.insightExpanded = !job.insightExpanded;

    if (job.insightExpanded) {
      job.needleAngle = -84;
      setTimeout(() => {
        job.needleAngle = this.calculateNeedleAngle(job.matchPercentage || 0);
      }, 10);
    } else {
      job.needleAngle = -84;
    }
  }

  toggleProgressImage(job: JobCardData) {
    job.progressImageExpanded = !job.progressImageExpanded;
  }

  calculateNeedleAngle(percentage: number): number {
    percentage = Math.max(0, Math.min(100, percentage));

    const minAngle = -84;
    const maxAngle = 84;

    return minAngle + (percentage / 100) * (maxAngle - minAngle);
  }

  getMatchLevel(percentage: number): string {
    if (percentage < 33) return 'Low';
    if (percentage < 66) return 'Medium';
    return 'Medium';
  }

  selectSection(sectionName: string) {
    this.selectedFilter = sectionName;
    this.showDropdown = false;
  }

  getSelectedSections() {
    if (!this.selectedFilter) return [];
    return this.filterSections.filter(
      (s) => s.sectionName === this.selectedFilter
    );
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const messagePopup = document.querySelector('.fixed.bottom-4.right-4');

    if (
      this.showMessagePopup &&
      messagePopup &&
      !messagePopup.contains(event.target as Node)
    ) {
      const sendMessageButtons = document.querySelectorAll(
        '[aria-label="Send Message"]'
      );
      let isSendMessageButton = false;

      sendMessageButtons.forEach((button) => {
        if (button.contains(event.target as Node)) {
          isSendMessageButton = true;
        }
      });

      if (!isSendMessageButton) {
        this.showMessagePopup = false;
      }
    }
    if (
      this.showPicker &&
      !this.datePickerContainer?.nativeElement.contains(event.target)
    ) {
      this.showPicker = false;
    }

    if (
      this.showDropdown &&
      !this.dropdownContainer?.nativeElement.contains(event.target)
    ) {
      this.showDropdown = false;
    }
  }

  handleUndoClick(job: JobCardData) {
    console.log('Undo clicked for job:', job.id);
    this.showUndoApplicationModal(job);
  }

  showFeedbackMessage(message: string) {
    alert(message);
  }

  ngOnChanges() {
    this.config.totalPages = Math.ceil(this.jobsData.length / 5);
  }

  handlePageChange(
    type: 'previous' | 'next' | 'page',
    page?: number | string
  ): void {
    let newPage = this.currentPage;

    switch (type) {
      case 'previous':
        newPage = Math.max(1, this.currentPage - 1);
        break;
      case 'next':
        newPage = Math.min(this.totalPages, this.currentPage + 1);
        break;
      case 'page':
        if (typeof page === 'number') {
          newPage = page;
        }
        break;
    }

    if (newPage !== this.currentPage) {
      this.currentPage = newPage;
      this.config.currentPage = newPage;
      this.updatePaginatedJobs();
    }
  }
  getButtonClasses(
    type: 'previous' | 'next' | 'page',
    isActive = false
  ): string {
    if (type === 'page' && isActive) {
      return 'active-page';
    }
    return '';
  }

  get visiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const current = this.currentPage;
    const total = this.totalPages;
    const maxVisible = this.config.maxVisiblePages || 5;

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisible / 2);
      let start = Math.max(current - half, 1);
      let end = Math.min(start + maxVisible - 1, total);

      if (end - start + 1 < maxVisible) {
        start = Math.max(end - maxVisible + 1, 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }

      for (let i = start; i <= end; i++) {
        if (i > 0 && i <= total) {
          pages.push(i);
        }
      }

      if (end < total) {
        if (end < total - 1) {
          pages.push('...');
        }
        pages.push(total);
      }
    }

    return pages;
  }

  trackByPage(index: number, page: number | string): string {
    return `${index}-${page}`;
  }

  get conicGradient(): string {
    const progress = this.inputProgress / this.max;
    return `conic-gradient(#17B26A ${progress * 100}%, transparent ${
      progress * 100
    }% 100%)`;
  }

  getAvatarSize(): number {
    switch (this.avatarSize) {
      case 'sm':
        return 32;
      case 'lg':
        return 56;
      default:
        return 44;
    }
  }

  onMinimize(): void {
    this.minimize.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  getProgressOffset(): number {
    const circumference = 62.8;
    if (this.remainingMessages === 3) {
      return 0;
    } else if (this.remainingMessages === 2) {
      return circumference * 0.25;
    } else if (this.remainingMessages === 1) {
      return circumference * 0.7;
    } else {
      return circumference;
    }
  }

  getProgressColor(): string {
    const remaining = this.getRemainingConsecutiveACount();
    const remainingCount = Number(remaining);

    if (remainingCount === 0) {
      return '#F04438';
    } else if (remainingCount === 1) {
      return '#FDB022';
    } else {
      return '#17B26A';
    }
  }

  get progressText(): string {
    return this.remainingMessages.toString().padStart(2, '0');
  }

  getProgressDisplay(): string {
    const remaining = this.getRemainingConsecutiveACount();
    return remaining.toString().padStart(2, '0');
  }

  getStatusMessageRemain(): string {
    const remaining = this.getRemainingConsecutiveACount();
    return `${remaining.toString().padStart(2, '0')}/03`;
  }

  fetchInitialChatData() {
    if (!this.UserGuid) {
      console.error('UserGuid not available');
      return;
    }

    this.http
      .get(
        'https://mybdjobsorchestrator-odcx6humqq-as.a.run.app/api/EmployerActivities/GetMessageList?UserGuid=' +
          encodeURIComponent(this.UserGuid)
      )
      .subscribe({
        next: (response: any) => {
          this.chatApiResponse = response;
          this.circularLoaderService.setLoading(false);
          this.mergeChatDataWithJobs();
        },
        error: (error) => {
          console.error('Error loading chat data:', error);
          this.circularLoaderService.setLoading(false);
        },
      });
  }

  private mergeChatDataWithJobs() {
    if (!this.chatApiResponse?.event?.eventData?.[0]?.value) return;

    const conversations = this.chatApiResponse.event.eventData[0].value;

    this.appliedJobs.forEach((job) => {
      const conversation = conversations.find(
        (conv: any) => conv.jobId === job.jobId
      );
      if (conversation) {
        job.conversationId =
          conversation.conversationId?.toString() || job.conversationId;
        job.lastMessage = conversation.lastMessage;
        job.lastChattedOn = conversation.lastChattedOn;
        job.unreadMessage = conversation.unreadMessage;
        job.isRead = conversation.isRead;
        if (this.selectedJob && this.selectedJob.jobId === job.jobId) {
          this.fetchMessages(job.conversationId);
        }
      }
    });
  }

  fetchMessages(conversationId: string) {
    if (!conversationId || !this.selectedJob?.jobId) {
      console.error('Missing required parameters');
      return;
    }

    if (!this.UserGuid) {
      console.error('UserGuid not available - cannot fetch messages');
      return;
    }

    const params = {
      DeviceType: 'web',
      UserGuid: this.UserGuid,
      ConversationId: conversationId,
      SenderType: 'A',
      JobId: this.selectedJob.jobId,
    };

    this.http
      .get<any>(
        'https://mybdjobsorchestrator-odcx6humqq-as.a.run.app/api/EmployerActivities/GetMessages',
        { params }
      )
      .subscribe({
        next: (response) => {
          console.log('API Response:', response);
          if (response && response.length > 0) {
            const eventData = response[0].eventData;
            const chatData = eventData.find(
              (item: any) => item.key === 'Chat Message '
            );
            if (chatData && chatData.value) {
              this.chatMessages = chatData.value.map((msg: any) => ({
                textId: msg.textId,
                text: msg.text,
                textSenderType: msg.textSenderType,
                cnvId: msg.cnvId,
                textReadDate: msg.textReadDate,
                textReadTime: msg.textReadTime,
                textSendDate: msg.textSendDate,
                textSendTime: msg.textSendTime,
                employeeEmail: msg.employeeEmail,
                personalEmail: msg.personalEmail,
                textSendBy: msg.textSendBy,
                status: 'delivered',
              }));
              console.log('Processed messages:', this.chatMessages);
              this.checkMessageLimit();
            }
            const remainingMsgData = eventData.find(
              (item: any) => item.key === 'RemainingMessage'
            );
            if (remainingMsgData) {
              this.remainingMessages = remainingMsgData.value;
            }
          }
        },
        error: (error) => {
          console.error('Error fetching messages:', error);
        },
      });
  }

  toggleMessagePopup(job?: any) {
    if (job) {
      this.selectedJob = job;
      this.loadMessages(job);
    }
    this.showMessagePopup = !this.showMessagePopup;
  }

  loadMessages(job: any) {
    if (!this.UserGuid) {
      console.error('UserGuid not available');
      return;
    }

    this.selectedJob = job;
    const params = {
      DeviceType: 'web',
      UserGuid: this.UserGuid,
      JobId: job.jobId,
      SenderType: 'A',
      ConversationId: job.conversationId,
    };

    this.http
      .get(
        'https://mybdjobsorchestrator-odcx6humqq-as.a.run.app/api/EmployerActivities/GetMessages',
        { params }
      )
      .subscribe((response: any) => {
        if (response && response.length > 0) {
          const eventData = response[0].eventData;
          const chatMessagesData = eventData.find(
            (item: any) => item.key === 'Chat Message '
          );
          if (chatMessagesData && chatMessagesData.value) {
            this.chatMessages = chatMessagesData.value.map((msg: any) => ({
              textId: msg.textId,
              text: msg.text,
              textSenderType: msg.textSenderType,
              cnvId: msg.cnvId,
              textReadDate: msg.textReadDate,
              textReadTime: msg.textReadTime,
              textSendDate: msg.textSendDate,
              textSendTime: msg.textSendTime,
              employeeEmail: msg.employeeEmail,
              personalEmail: msg.personalEmail,
              textSendBy: msg.textSendBy,
              status: 'delivered',
            }));

            this.checkMessageLimit();
          }
          const remainingMsgData = eventData.find(
            (item: any) => item.key === 'RemainingMessage'
          );
          if (remainingMsgData) {
            this.remainingMessages = remainingMsgData.value;
          }
        }
      });
  }

  getRemainingConsecutiveACount(): string {
    let count = 0;
    for (let i = this.chatMessages.length - 1; i >= 0; i--) {
      if (this.chatMessages[i].textSenderType === 'A') {
        count++;
      } else if (this.chatMessages[i].textSenderType === 'R') {
        break;
      }
    }
    const remaining = Math.max(0, this.maxAllowedMessages - count);
    return remaining.toString().padStart(2, '0');
  }

  checkMessageLimit(): void {
    let consecutiveCount = 0;

    for (let i = this.chatMessages.length - 1; i >= 0; i--) {
      if (this.chatMessages[i].textSenderType === 'A') {
        consecutiveCount++;
        if (consecutiveCount >= this.maxAllowedMessages) {
          this.disableSendButton = true;
          return;
        }
      } else if (this.chatMessages[i].textSenderType === 'R') {
        this.disableSendButton = false;
        return;
      }
    }

    this.disableSendButton = false;
  }

  getRemainingMessagesCount(): number {
    return Math.max(0, this.maxAllowedMessages - this.sentMessagesCount);
  }

  getProgressText(): string {
    const remaining = this.getRemainingMessagesCount();

    return `${remaining.toString().padStart(2, '0')}`;
  }

  onSendMessage() {
    if (
      !this.messageText.trim() ||
      !this.selectedJob ||
      !this.selectedJob.conversationId
    ) {
      return;
    }

    if (this.getConsecutiveACount() >= this.maxAllowedMessages) {
      this.disableSendButton = true;
      return;
    }

    const payload = {
      userGuid: this.UserGuid,
      deviceType: 'web',
      conversationId: Number(this.selectedJob.conversationId),
      employerProfileId: 0,
      jobId: this.selectedJob.jobId,
      senderType: 'A',
      message: this.messageText,
      companyName: this.selectedJob.company || '',
    };

    const newMessage: ChatMessage = {
      textId: Date.now(),
      text: this.messageText,
      textSenderType: 'A',
      cnvId: Number(this.selectedJob.conversationId),
      textReadDate: '',
      textReadTime: '',
      textSendDate: new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      textSendTime: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sending',
      employeeEmail: '',
      personalEmail: null,
      textSendBy: null,
    };

    this.chatMessages.unshift(newMessage);
    this.messageText = '';
    this.checkConsecutiveMessages();

    this.http
      .post(
        'https://mybdjobsorchestrator-odcx6humqq-as.a.run.app/api/EmployerActivities/ApplicantMessageSend',
        payload
      )
      .subscribe({
        next: (response) => {
          const index = this.chatMessages.findIndex(
            (m) => m.textId === newMessage.textId
          );
          if (index !== -1) {
            this.chatMessages[index].status = 'delivered';
          }
          if (this.selectedJob) {
            this.fetchMessages(this.selectedJob.conversationId);
          }
        },
        error: (err) => {
          console.error('Error sending message:', err);
          const index = this.chatMessages.findIndex(
            (m) => m.textId === newMessage.textId
          );
          if (index !== -1) {
            this.chatMessages[index].status = 'failed';
          }
          this.checkConsecutiveMessages();
        },
      });
  }

  private getConsecutiveACount(): number {
    let count = 0;
    for (let i = this.chatMessages.length - 1; i >= 0; i--) {
      if (this.chatMessages[i].textSenderType === 'A') {
        count++;
      } else if (this.chatMessages[i].textSenderType === 'R') {
        break;
      }
    }
    return count;
  }

  getRemainingMessages(): number {
    return Math.max(0, this.maxAllowedMessages - this.getConsecutiveACount());
  }
  public showBoostdModalForNoteligible() {
    this.modalService.setModalConfigs({
      componentRef: AppliedJobsBoostingApplicationComponent,
      attributes: {
        modalWidth: '580px',
      },
    });
  }

  public showBoostDiscardModalForNormalUser() {
    this.modalService.setModalConfigs({
      componentRef: AppliedJobsBoostApplicationNormalUserModalComponent,
      attributes: {
        modalWidth: '580px',
      },
    });
  }

  public showBoostSuccessModal() {
    this.modalService.setModalConfigs({
      componentRef: AppliedjobsBoostSuccessModalComponent,
      attributes: {
        modalWidth: '580px',
      },
    });
  }

  onApplicationCancelled() {
    this.loadInitialData();
  }

  showUndoApplicationModal(job: JobCardData) {
    this.isModalOpen = true;
    this.selectedJob = job;

    this.modalService.setModalConfigs({
      componentRef: AppliedJobsUndoApplicationModalComponent,
      inputs: {
        jobId: job.id,
        userGuid: this.UserGuid,
      },
      attributes: {
        modalWidth: '580px',
      },
    });

    this.modalService.onCloseModal$.subscribe(() => {
      this.isModalOpen = false;
      this.loadInitialData();
    });
  }

  public showBoostModalForPro(job: JobCardData): void {
    if (!this.UserGuid) {
      console.error('UserGuid is required for boosting');
      return;
    }

    this.currentBoostJob = job;

    this.modalService.setModalConfigs({
      componentRef: AppliedjobsBoostApplicationForProComponent,
      attributes: {
        modalWidth: '580px',
        jobId: job.id,
        userGuid: this.UserGuid as string,
      },
      callbacks: {
        boostSuccess: () => this.handleBoostSuccess(),
      },
    });
  }

  private handleBoostSuccess(): void {
    if (!this.currentBoostJob) return;

    this.currentBoostJob.isBoosted = 1;

    this.modalService.setModalConfigs({
      componentRef: AppliedjobsBoostSuccessModalComponent,
      attributes: {
        modalWidth: '580px',
        title: 'Application Boosted!',
        description: 'Your application has been successfully boosted.',
        confirmText: 'Done',
      },
    });

    this.currentBoostJob = null;
  }

  handleBoostApplication(job: JobCardData): void {
    if (job.isBoosted === 1) {
      return;
    }
    if ((job.matchPercentage ?? 0) < 60) {
      this.showBoostdModalForNoteligible();
      return;
    }

    const isPro = this.IsBdjobsPro?.toLowerCase() === 'true';

    if (isPro) {
      this.showBoostModalForPro(job);
    } else {
      this.showBoostDiscardModalForNormalUser();
    }
  }

  private processApiResponse(
    response: CareerInfoResponse,
    page?: number
  ): void {
    if (!response?.event?.eventData?.[0]?.value?.data) {
      console.log('No job data in API response:', response);
      this.appliedJobs = [];
      this.paginatedJobs = [];
      this.totalJobsCount = 0;
      return;
    }

    const responseData = response.event.eventData[0].value;
    const jobsData = responseData.data;
    console.log('API response jobs:', jobsData);
    if (responseData.activity && responseData.activity.length > 0) {
      const activity = responseData.activity[0];
      this.contactedCount = activity.totalContacted;
      this.joinedCount = activity.totalHired;
      this.offeredCount = activity.totalOffered;
    }

    this.totalJobsCount = responseData.common.tottalNumberOfJob;
    this.appliedJobs = jobsData.map((job) => this.transformJobData(job));
    this.initializePagination();
  }

  private transformJobData(job: any): JobCardData {
    let statusType: JobStatusType = 'pending';
    let reasonId: number | undefined;

    switch (job.status) {
      case '2':
        statusType = 'contacted';
        break;
      case '3':
        statusType = 'joined';
        break;
      case '4':
        statusType = 'not-joined';
        reasonId = job.reasonId;
        break;
      case '5':
        statusType = 'offered';
        break;
      default:
        statusType = 'pending';
    }

    return {
      id: job.jobId.toString(),
      company: job.companyName,
      title: job.title,
      appliedDate: this.formatAppliedDate(job.appliedOn),
      salary: job.expectedSalary?.toString() || '0',
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      viewedByEmployer: job.viewedByEmployer,
      isCancelled: job.isCancleApply,
      isBoosted: job.isBoosted,
      statusType: statusType,
      profileMatched: job.profileMatched,
      totalApplicant: job.totalApplicant,
      totalShortlisted: job.totalShortlisted,
      totalViewed: job.totalViewed,
      recruitmentStatus: job.recruitmentStatus,
      isVideoResumeRequired: job.isVideoResumeRequired,
      isCustomResumeRequired: job.isCustomResumeRequired,
      matchPercentage: job.profileMatched,
      pendingIcon: '',
      insightExpanded: false,
      profileViewIcon:
        job.viewedByEmployer === 'Yes'
          ? 'images/profile-viewed.svg'
          : 'images/profile-not-viewed.svg',
      profileViewText:
        job.viewedByEmployer === 'Yes'
          ? 'Profile Viewed'
          : 'Profile Not Viewed',
      matchIcon: 'images/question.svg',
      statusMessage: this.generateStatusMessage(statusType, reasonId),
      needleAngle: -84,
      showActionButtons: true,
      isDetailedViewed: job.isDetailedViewed,
      deadLine: job.deadLine,
      messageInitiate: job.messageInitiate,
      isFairJob: job.isFairJob,
      isLinkedInApply: job.isLinkedInApply,
      hasInsight: true,
      isInsightBlurred: this.IsBdjobsPro?.toLowerCase() !== 'true',
      insightUnlocked: false,
      reasonId: job.reasonId,
      status: job.status,
      hideStatusBadge: false,
      conversationId: job.conversationId?.toString() || '',
      companyId: job.companyId || 0,
      jobId: job.jobId || 0,
      companyName: job.companyName || '',
      lastChattedOn: job.lastChattedOn || '',
      lastMessage: job.lastMessage || '',
      unreadMessage: job.unreadMessage || 0,
      isRead: job.isRead || false,
      companyLogo: job.companyLogo || '',
    };
  }

  private formatAppliedDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  private generateStatusMessage(
    statusType: JobStatusType,
    reasonId?: number
  ): string {
    const statusMessages: Record<JobStatusType, string> = {
      pending: 'Did the employer call or message you?',
      contacted: 'Has the employer offered you?',
      offered: 'Have you joined?',
      joined: 'You have joined this company',
      'not-joined': reasonId
        ? this.getNotJoinedReasonMessage(reasonId)
        : 'Not joined',
      'not-contacted': 'Not contacted yet',
      'not-contacted-temp': 'Not contacted yet',
      'not-offered': 'Not offered',
      'not-offered-temp': 'Not offered',
      rejected: 'Application rejected',
      'not-joined-hidden': 'not-joined-hidden',
    };

    return statusMessages[statusType] || 'Application status: ' + statusType;
  }

  private getNotJoinedReasonMessage(reasonId: number): string {
    const reasons: Record<number, string> = {
      1: ' Not interested to work in the organization',
      2: ' The office is far away from my residence',
      3: ' I am already employed and do not want to switch job',
      4: ' Other reasons',
    };

    return reasons[reasonId] || 'Reason: Unknown reason';
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.loadCareerInfo(this.getCurrentFilters(), page);
  }

  private getCurrentFilters(): any {
    return {
      FromDate: this.selectedStartDate
        ? this.formatDateForApi(this.selectedStartDate)
        : '',
      ToDate: this.selectedEndDate
        ? this.formatDateForApi(this.selectedEndDate)
        : '00:00:00',
      CompanyName: this.companyNameControl.value || '',
      ...this.getCheckedOptions(),
    };
  }

  calculateTotalPages() {
    this.config.totalPages = Math.ceil(this.appliedJobs.length / 5);
  }

  applyFilters() {
    if (!this.UserGuid) {
      console.error('UserGuid not available - cannot apply filters');
      return;
    }

    this.currentPage = 1;
    this.config.currentPage = 1;

    const payload: GetCareerInfoQuery = {
      UserGuid: this.UserGuid,
      IsBdjobsPro: this.IsBdjobsPro,
      FromDate: this.selectedStartDate
        ? this.formatDateForApi(this.selectedStartDate)
        : '',
      ToDate: this.selectedEndDate
        ? this.formatDateForApi(this.selectedEndDate)
        : '00:00:00',
      CompanyName: this.companyNameControl.value || '',
      SelectValue: this.selectedOptionValue?.toString() || '',
      ...this.getCheckedOptions(),
    };

    this.loadCareerInfo(payload, 1);
  }
  private formatDateForApi(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year} 00:00:00`;
  }

  private getCheckedOptions(): any {
    const filters: any = {};

    this.filterSections.forEach((section) => {
      section.options.forEach((option) => {
        if (option.checked) {
          const paramName = this.mapOptionToParam(
            section.sectionName,
            option.id
          );
          filters[paramName] = true;
        }
      });
    });

    return filters;
  }

  private mapOptionToParam(section: string, optionId: string): string {
    const mapping: any = {
      'employers-actions': {
        viewed: 'IsViewed',
        'not-viewed': 'IsNotViewed',
      },
      'pending-required': {
        'video-cv': 'IsVideoCVRequired',
        'customized-cv': 'IsCustomCVRequired',
      },
      boosting: {
        boosted: 'IsBoosted',
        'not-boosted': 'IsNotBoosted',
      },
      'recruitment-status': {
        contacted: 'IsContacted',
        offered: 'IsOffered',
        joined: 'IsJoined',
      },
    };

    return mapping[section]?.[optionId] || optionId;
  }

  showDatePicker() {
    this.showPicker = true;
  }

  onStartDateChange(date: Date | null) {
    this.selectedStartDate = date;
    this.updateDateRangeDisplay();
  }

  onEndDateChange(date: Date | null) {
    this.selectedEndDate = date;
    this.updateDateRangeDisplay();
  }

  onClosePicker() {
    this.showPicker = false;
  }

  updateDateRangeDisplay() {
    if (this.selectedStartDate && this.selectedEndDate) {
      this.dateRangeDisplay = `${this.formatDate(
        this.selectedStartDate
      )} - ${this.formatDate(this.selectedEndDate)}`;
    } else if (this.selectedStartDate) {
      this.dateRangeDisplay = this.formatDate(this.selectedStartDate);
    } else if (this.selectedEndDate) {
      this.dateRangeDisplay = this.formatDate(this.selectedEndDate);
    } else {
      this.dateRangeDisplay = '';
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  private loadCareerInfo(filters?: any, page: number = 1): void {
    if (!this.UserGuid) {
      console.error('UserGuid not available - cannot load career info');
      this.circularLoaderService.setLoading(false);
      return;
    }

    const query: GetCareerInfoQuery = {
      UserGuid: this.UserGuid,
      Version: 'EN',
      NoOfRecordPerPage: this.itemsPerPage,
      PageNumber: page,
      IsBdjobsPro: this.IsBdjobsPro,
      ...filters,
    };

    this.circularLoaderService.setLoading(true);

    this.careerService
      .getAppliedJobs(query)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.circularLoaderService.setLoading(false))
      )
      .subscribe({
        next: (response: CareerInfoResponse) => {
          this.processApiResponse(response, page);
        },
        error: (error) => {
          console.error('Error fetching applied jobs:', error);
        },
      });
  }

  private setupCompanySuggestions() {
    this.companyNameControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          this.isLoadingSuggestions = true;
          return this.careerService
            .getCompanySuggestions(term || '')
            .pipe(finalize(() => (this.isLoadingSuggestions = false)));
        })
      )
      .subscribe((suggestions) => {
        this.companySuggestions = suggestions;
        this.showSuggestions =
          suggestions.length > 0 && this.companyNameControl.value !== '';
      });
  }

  selectSuggestion(suggestion: string) {
    this.companyNameControl.setValue(suggestion);
    this.showSuggestions = false;
    this.companySuggestions = [];
  }

  onCompanyInput() {
    const value = this.companyNameControl.value;
    this.showSuggestions = value !== '' && value !== null;
  }

  getSelectedOptionText(): string {
    if (!this.selectedOption) return 'Select';

    for (const section of this.filterSections) {
      const selected = section.options.find(
        (opt) => opt.id === this.selectedOption
      );
      if (selected) return selected.label;
    }
    return 'Select';
  }

  onOptionSelect(option: any): void {
    this.selectedOption = option.id;
    this.selectedOptionValue = option.value;
    this.showDropdown = false;
  }
  showSalaryEditPopup = false;
  currentEditingJob: JobCardData | null = null;
  salaryEditControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[0-9]*$/),
  ]);

  canEditSalary(job: JobCardData): boolean {
    if (!job) return false;
    if (
      job.isDetailedViewed ||
      new Date(job.deadLine) < new Date() ||
      job.isBoosted ||
      job.messageInitiate ||
      job.isFairJob ||
      job.isLinkedInApply
    ) {
      return false;
    }
    return true;
  }

  isEditingSalary(job: JobCardData): boolean {
    return this.editingJobId === job.id;
  }

  startSalaryEdit(job: JobCardData): void {
    if (!this.canEditSalary(job)) return;
    this.editingJobId = job.id;
    this.originalSalary = job.salary;
  }

  cancelSalaryEdit(): void {
    if (this.editingJobId && this.originalSalary) {
      const job = this.jobsData.find((j) => j.id === this.editingJobId);
      if (job) {
        job.salary = this.originalSalary;
      }
    }
    this.editingJobId = null;
    this.originalSalary = null;
  }

  saveSalaryEdit(job: JobCardData): void {
    if (!job.salary) return;

    if (!this.UserGuid) {
      console.error('UserGuid not available - cannot save salary edit');
      return;
    }

    const payload = {
      userGuid: this.UserGuid,
      jobId: Number(job.id),
      newSalary: Number(job.salary),
    };

    this.http
      .put<any>(
        'https://useractivitysubsystem-odcx6humqq-as.a.run.app/api/AppliedJob/UpdateExpectedSalary',
        payload
      )
      .subscribe({
        next: (response) => {
          if (response && response[0]?.eventType === 1) {
            this.editingJobId = null;
            this.originalSalary = null;
          }
        },
        error: (error) => {
          console.error('Error updating salary:', error);
          if (this.originalSalary) {
            job.salary = this.originalSalary;
          }
          this.editingJobId = null;
          this.originalSalary = null;
        },
      });
  }

  getSafeStatusType(job: JobCardData): string {
    return job.statusType || 'pending';
  }

  handleInsightUnlock() {
    this.insightUnlocked = true;
  }

  getStatusMessage(job: JobCardData): string {
    switch (job.statusType) {
      case 'not-contacted':
      case 'not-contacted-temp':
        return 'Not contacted yet';
      case 'contacted':
        return 'Has the employer offered you?';
      case 'not-offered':
      case 'not-offered-temp':
        return 'Not offered';
      case 'offered':
        return 'Have you joined?';
      case 'not-joined':
        return job.statusMessage || 'Not joined';
      case 'joined':
        return 'You have joined this company';
      default:
        return 'Has the employer contacted you?';
    }
  }

  shouldShowStatusBadge(job: JobCardData): boolean {
    if (job.hideStatusBadge || !job.statusType) return false;

    return [
      'contacted',
      'offered',
      'not-joined',
      'not-contacted',
      'not-contacted-temp',
    ].includes(job.statusType);
  }

  shouldShowEditIcon(job: JobCardData): boolean {
    return [
      'contacted',
      'not-contacted',
      'not-contacted-temp',
      'not-joined',
    ].includes(job.statusType || '');
  }

  getStatusBadgeText(job: JobCardData): string {
    switch (job.statusType) {
      case 'contacted':
        return 'Contacted';
      case 'offered':
        return 'Offered';
      case 'not-joined':
        return 'Not Joined';
      case 'not-contacted':
      case 'not-contacted-temp':
        return 'Not Contacted';
      default:
        return '';
    }
  }

  shouldShowOptions(job: JobCardData): boolean {
    if (job.deadLine) {
      const now = new Date();
      const deadline = new Date(job.deadLine);
      if (isNaN(deadline.getTime())) {
        console.warn(`Invalid deadline for job ${job.id}: ${job.deadLine}`);
        return false;
      }

      if (deadline > now) {
        console.log(
          `Job ${job.id}: Deadline ${deadline} is in the future, hiding options`
        );
        return false;
      }
    }
    if (job.statusMessage?.includes('Reason:')) {
      console.log(
        `Job ${job.id}: Status message includes 'Reason:', hiding options`
      );
      return false;
    }

    switch (job.statusType) {
      case 'not-contacted-temp':
      case 'not-offered-temp':
      case 'pending':
      case 'contacted':
      case 'offered':
        console.log(
          `Job ${job.id}: statusType=${job.statusType}, showing options`
        );
        return true;
      case 'not-contacted':
      case 'not-offered':
      case 'not-joined':
      case 'joined':
        console.log(
          `Job ${job.id}: statusType=${job.statusType}, hiding options`
        );
        return false;
      default:
        console.log(`Job ${job.id}: Default case, showing options`);
        return true;
    }
  }

  shouldShowUndoButton(job: JobCardData): boolean {
    if (
      job.isBoosted === 1 ||
      job.messageInitiate === 1 ||
      job.isCancelled === 1 ||
      job.isDetailedViewed === 1 ||
      job.viewedByEmployer === 'Yes'
    ) {
      return false;
    }

    if (job.deadLine) {
      const now = new Date();
      const deadline = new Date(job.deadLine);
      if (!isNaN(deadline.getTime()) && deadline < now) {
        return false;
      }
    }

    if (job.recruitmentStatus) {
      return false;
    }

    return true;
  }

  getButtonText(job: JobCardData): { yes: string; no: string } {
    if (
      !job.statusType ||
      job.statusType === 'pending' ||
      job.statusType === 'not-contacted-temp'
    ) {
      return { yes: 'Yes', no: 'Not yet' };
    } else if (
      job.statusType === 'contacted' ||
      job.statusType === 'not-offered-temp'
    ) {
      return { yes: 'Yes', no: 'Not yet' };
    } else if (job.statusType === 'offered') {
      return { yes: 'Yes', no: 'No' };
    }
    return { yes: 'Yes', no: 'No' };
  }

  resetStatus(job: JobCardData) {
    if (job.statusType === 'not-joined') {
      job.hideStatusBadge = true;
    } else {
      job.statusType = undefined;
      job.statusMessage = undefined;
    }
  }

  private updateJobStatus(job: JobCardData, responseType: number): void {
    const payload = {
      userGuid: this.UserGuid,
      jobId: Number(job.id),
      experienceId: 0,
      status: this.mapStatusToApiValue(responseType),
      reasonId: 0,
      reasonPackage: '',
      responseType: responseType,
    };

    this.careerService.updateJobStatus(payload).subscribe({
      next: () => {
        if (!job.statusType?.includes('-temp')) {
          this.saveStatusToLocalStorage(job);
        }
      },
      error: (error) => console.error('Status update failed:', error),
    });
  }

  private saveStatusToLocalStorage(job: JobCardData): void {
    const storedStatuses = localStorage.getItem('jobStatuses');
    let jobStatuses: {
      [key: string]: {
        statusType: JobStatusType;
        statusMessage?: string;
        reasonId?: number;
      };
    } = {};

    if (storedStatuses) {
      jobStatuses = JSON.parse(storedStatuses);
    }

    jobStatuses[job.id] = {
      statusType: job.statusType || 'pending',
      statusMessage: job.statusMessage,
      reasonId: job.reasonId,
    };

    localStorage.setItem('jobStatuses', JSON.stringify(jobStatuses));
  }

  private mapStatusToApiValue(responseType: number): string {
    switch (responseType) {
      case 2:
        return '2';
      case 5:
        return '5';
      case 3:
        return '3';
      case 4:
        return '4';
      default:
        return '';
    }
  }

  handleYesClick(job: JobCardData) {
    if (!job.statusType || job.statusType === 'pending') {
      this.updateJobStatus(job, 2);
      job.statusType = 'contacted';
    } else if (job.statusType === 'contacted') {
      this.updateJobStatus(job, 5);
      job.statusType = 'offered';
    } else if (job.statusType === 'offered') {
      this.updateJobStatus(job, 3);
      job.statusType = 'joined';
      this.showAddExperienceModal(job);
    }
  }

  handleNoClick(job: JobCardData) {
    if (job.statusType === 'offered') {
      this.showNotJoinedModal(job);
    } else {
      const showPermanentNo = this.shouldShowPermanentOption(
        job,
        !job.statusType || job.statusType === 'pending' ? 3 : 5
      );

      if (showPermanentNo) {
        const newStatus =
          !job.statusType || job.statusType === 'pending'
            ? 'not-contacted'
            : 'not-offered';
        this.updateJobStatus(job, newStatus === 'not-contacted' ? 1 : 4);
        job.statusType = newStatus;
      } else {
        job.statusType =
          !job.statusType || job.statusType === 'pending'
            ? 'not-contacted-temp'
            : 'not-offered-temp';
      }
    }
  }

  handleNotYetClick(job: JobCardData) {
    if (!job.deadLine) return;

    const now = new Date();
    const deadline = new Date(job.deadLine);
    const monthsDiff =
      (now.getFullYear() - deadline.getFullYear()) * 12 +
      (now.getMonth() - deadline.getMonth());

    if (!job.statusType || job.statusType === 'pending') {
      if (monthsDiff >= 3) {
        job.statusType = 'not-contacted';
      } else {
        job.statusType = 'not-contacted-temp';
      }
    } else if (job.statusType === 'contacted') {
      if (monthsDiff >= 5) {
        job.statusType = 'not-offered';
      } else {
        job.statusType = 'not-offered-temp';
      }
    }
  }

  public showAddExperienceModal(job: JobCardData) {
    if (!this.UserGuid) {
      console.error('UserGuid is required but was null');
      return;
    }

    this.careerService.getExperienceList(this.UserGuid).subscribe({
      next: (response: ExperienceApiResponse) => {
        const experiences = response.event?.eventData?.[0]?.value || [];

        this.modalService.setModalConfigs({
          componentRef: AppiledJobsExperienceModalComponent,
          attributes: {
            modalWidth: '580px',
          },
          inputs: {
            experiences: experiences,
            jobTitle: job.title,
            userGuid: this.UserGuid,
            jobId: Number(job.id),
          },
          callbacks: {
            closed: () => {
              this.loadInitialData();
            },
          },
        });
      },
      error: (error) => {
        console.error('Failed to load experiences:', error);
      },
    });
  }

  private showNotJoinedModal(job: JobCardData): void {
    console.log(
      'Opening Not Joined modal for job:',
      job.id,
      'with userGuid:',
      this.UserGuid
    );
    if (!this.UserGuid || !job.id) {
      console.error('Missing userGuid or jobId:', {
        userGuid: this.UserGuid,
        jobId: job.id,
      });
      alert('Cannot open modal: Missing user or job details.');
      return;
    }

    this.modalService.setModalConfigs({
      componentRef: AppiledJobsNotJoinedModalComponent,
      attributes: {
        modalWidth: '580px',
      },
      inputs: {
        userGuid: this.UserGuid,
        jobId: Number(job.id),
      },
      callbacks: {
        reasonSelected: (reasonId: number) => {
          console.log('Reason selected from modal:', reasonId);
          this.updateNotJoinedStatus(job, reasonId);
        },
      },
    });

    this.modalService.onCloseModal$.subscribe(() => {
      console.log('Not Joined modal closed');
      this.loadInitialData();
    });
  }

  private checkConsecutiveMessages(): void {
    let consecutiveCount = 0;
    for (let i = this.chatMessages.length - 1; i >= 0; i--) {
      if (this.chatMessages[i].textSenderType === 'A') {
        consecutiveCount++;
        if (consecutiveCount >= this.maxAllowedMessages) {
          this.disableSendButton = true;
          return;
        }
      } else if (this.chatMessages[i].textSenderType === 'R') {
        break;
      }
    }

    this.disableSendButton = consecutiveCount >= this.maxAllowedMessages;
  }

  private updateNotJoinedStatus(job: JobCardData, reasonId: number): void {
    const payload = {
      userGuid: this.UserGuid,
      jobId: Number(job.id),
      experienceId: 0,
      status: '4',
      reasonId: reasonId,
      reasonPackage: '',
      responseType: 4,
    };

    console.log('Sending payload:', payload);

    this.careerService.updateJobStatus(payload).subscribe({
      next: (response) => {
        console.log('Not Joined status updated successfully:', response);
        job.statusType = 'not-joined';
        job.statusMessage = this.generateStatusMessage('not-joined', reasonId);
        job.reasonId = reasonId;
        this.saveStatusToLocalStorage(job);
        this.loadInitialData();
      },
      error: (error) => {
        console.error('Failed to update Not Joined status:', error);
        alert('Failed to update status. Please try again.');
      },
    });
  }

  private shouldShowPermanentOption(
    job: JobCardData,
    monthsThreshold: number
  ): boolean {
    if (!job.deadLine) return false;

    const deadline = new Date(job.deadLine);
    const now = new Date();
    const monthsDiff =
      (now.getFullYear() - deadline.getFullYear()) * 12 +
      (now.getMonth() - deadline.getMonth());

    return monthsDiff >= monthsThreshold;
  }

  getStatusOptions(job: JobCardData): { yes: string; no: string } {
    if (!job.statusType || job.statusType === 'pending') {
      const showPermanentNo = this.shouldShowPermanentOption(job, 3);
      return {
        yes: 'Yes',
        no: showPermanentNo ? 'No' : 'Not yet',
      };
    }

    if (job.statusType === 'contacted') {
      const showPermanentNo = this.shouldShowPermanentOption(job, 5);
      return {
        yes: 'Yes',
        no: showPermanentNo ? 'No' : 'Not yet',
      };
    }

    if (job.statusType === 'offered') {
      return { yes: 'Yes', no: 'No' };
    }

    return { yes: 'Yes', no: 'No' };
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.showTooltip && this.tooltipTarget) {
      const rect = this.tooltipTarget.nativeElement.getBoundingClientRect();
      this.tooltipTop = rect.bottom + 10;
      this.tooltipLeft = rect.left + rect.width / 2 - 128 - 20;
    }
  }

  showTooltipAt(target: 'matchIcon' | 'gauge') {
    this.showTooltip = true;
    let rect: DOMRect;

    if (target === 'matchIcon' && this.matchIconRef) {
      rect = this.matchIconRef.nativeElement.getBoundingClientRect();
      this.tooltipTop = rect.bottom + 10;
      this.tooltipLeft = rect.left + rect.width / 2 - 128 - 20;
    }

    if (target === 'gauge' && this.gaugeRef) {
      rect = this.gaugeRef.nativeElement.getBoundingClientRect();
      this.tooltipTop = rect.bottom + 10;
      this.tooltipLeft = rect.left + rect.width / 2 - 128 - 40;
    }
  }

  hideTooltip() {
    this.showTooltip = false;
  }

  getStatusBadgeTranslationKey(job: JobCardData): string {
    switch (job.statusType) {
      case 'contacted':
        return 'appliedJobs.appliedJobs.status.contacted';
      case 'offered':
        return 'appliedJobs.appliedJobs.status.offered';
      case 'not-joined':
        return 'appliedJobs.appliedJobs.status.notJoined';
      case 'not-contacted':
      case 'not-contacted-temp':
        return 'appliedJobs.appliedJobs.status.notContacted';
      default:
        return '';
    }
  }

  getStatusMessageTranslationKey(job: JobCardData): string {
    switch (job.statusType) {
      case 'pending':
        return 'appliedJobs.appliedJobs.status.pendingMessage';
      case 'contacted':
        return 'appliedJobs.appliedJobs.status.contactedMessage';
      case 'offered':
        return 'appliedJobs.appliedJobs.status.offeredMessage';
      case 'joined':
        return 'appliedJobs.appliedJobs.status.joinedMessage';
      case 'not-joined':
        return (
          job.statusMessage || 'appliedJobs.appliedJobs.status.notJoinedMessage'
        );
      case 'not-contacted':
        return 'appliedJobs.appliedJobs.status.notContactedMessage';
      case 'not-contacted-temp':
        return 'appliedJobs.appliedJobs.status.notContactedTempMessage';
      case 'not-offered':
        return 'appliedJobs.appliedJobs.status.notOfferedMessage';
      case 'not-offered-temp':
        return 'appliedJobs.appliedJobs.status.notOfferedTempMessage';
      case 'rejected':
        return 'appliedJobs.appliedJobs.status.rejectedMessage';
      default:
        return 'appliedJobs.appliedJobs.status.defaultMessage';
    }
  }

  getButtonTranslationKey(job: JobCardData): { yes: string; no: string } {
    if (!job.statusType || job.statusType === 'pending') {
      const showPermanentNo = this.shouldShowPermanentOption(job, 3);
      return {
        yes: 'appliedJobs.appliedJobs.buttons.yes',
        no: showPermanentNo
          ? 'appliedJobs.appliedJobs.buttons.no'
          : 'appliedJobs.appliedJobs.buttons.notYet',
      };
    }

    if (job.statusType === 'contacted') {
      const showPermanentNo = this.shouldShowPermanentOption(job, 5);
      return {
        yes: 'appliedJobs.appliedJobs.buttons.yes',
        no: showPermanentNo
          ? 'appliedJobs.appliedJobs.buttons.no'
          : 'appliedJobs.appliedJobs.buttons.notYet',
      };
    }

    if (job.statusType === 'offered') {
      return {
        yes: 'appliedJobs.appliedJobs.buttons.yes',
        no: 'appliedJobs.appliedJobs.buttons.no',
      };
    }

    return {
      yes: 'appliedJobs.appliedJobs.buttons.yes',
      no: 'appliedJobs.appliedJobs.buttons.no',
    };
  }
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  AfterViewChecked,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { Message } from '../../../../shared/models/models';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployerMessageService } from '../services/employer-message.service';
import { CookieService } from '../../../../core/services/cookie/cookie.service';
import {
  ChatMessage,
  ChatMessageEventData,
  EmployerInfoEventData,
  SendMessageRequest,
} from '../models/employer-message';
import { LoginService } from '../../../signin/services/login.service';
import { SharedService } from '../../../signin/services/share.service';
import { BdjobsPro } from '../../../my-activities/applied-jobs/models/appliedJobs.model';

@Component({
  selector: 'app-view-employer-message',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-employer-message.component.html',
  styleUrl: './view-employer-message.component.scss',
})
export class ViewEmployerMessageComponent implements AfterViewChecked {
  @Input() headerTitle: string = 'View Employer Message';
  @Input() headerSubtitle: string =
    'Read the latest communication from your employer';
  @Input() headerButtonText: string = 'Get bdjobs pro';
  @Input() upgradeNowButtonText: string = 'Upgrade Plan';
  @Input() badgeMessage: string = 'New Message Limit';
  @Input() badgeIconSrc: string = 'images/reviewhelp-circle.svg';
  @Input() progressValue: string = '00';
  @Input() emptyStateTitle: string = "You Don't Have Any Messages Yet";
  @Input() emptyStateDescription: string =
    "You haven't applied to any jobs yet. Once you apply, you'll be able to message the";
  @Input() emptyStateAdditionalText: string = 'employer directly if you have a';
  @Input() emptyStateSubscriptionText: string = 'subscription.';
  @Input() emptyStateButtonText: string = 'Go to Job List';
  @Input() emptyStateIllustrationSrc: string =
    'images/eployermessagelanding.svg';
  @Input() emptyStateIllustrationSrcPro: string = 'images/proemptyinbox.svg';
  @Input() emptyStateBadgeSrc: string = 'images/bdjobs-pro.svg';
  @Input() emptyStateButtonIconSrc: string = 'images/arrow-right.svg';
  @Output() getProClick = new EventEmitter<void>();
  @Output() goToJobListClick = new EventEmitter<void>();
  @Input() logoUrl: string = 'images/bdjobs-pro.svg';
  @Input() logoAltText: string = 'Frame';
  @Input() promoText: string =
    "Subscription use 'You May Message' feature. Unlock now!";
  @Input() buttonText: string = 'Get bdjobs pro';
  @Output() promoButtonClick = new EventEmitter<void>();
  @Input() inputPlaceholder: string = 'Write your message..';
  @Input() currentMessage: string = '';
  @Output() messageChange = new EventEmitter<string>();
  @Output() sendMessage = new EventEmitter<void>();
  @Input() current: number = 2;
  @Input() max: number = 3;
  @Input() maxMessage: number = 30;
  @Input() title: string = 'Your message limit has been reached.';
  @Input() description: string =
    'You can send up to 3 messages at a time. If the employer replies to you, can message again. Please wait for their response.';
  @Input() ariaLabel: string = 'Error alert notification';
  private _currentAvaileableMessage: number = 30;
  activeTab: 'all' | 'unread' | 'mayMessage' = 'all';
  showMessagesSection = false;
  selectedMessage: any = null;
  packageExpired: boolean = false;
  showChatView = false;
  searchTerm: string = '';
  isProUser: boolean = true;
  hideProgressRing: boolean = false;
  showUpgradeToast: boolean = false;
  toastShown: boolean = false;
  userGuid: string | null = null;
  sentMessageCounts: { [key: string]: number } = {};
  limitReached: { [key: string]: boolean } = {};
  messages: Message[] = [];
  IsBdjobsPro: string = 'false';
  allmessages: Message[] = [];
  hasMessagesFromEmployer: boolean = false;
  hasReceiverMessage: boolean = true;
  toastPermanentlyDismissed: boolean = false;
  bdjobsProInfo: BdjobsPro | null = null;
  @ViewChild('messageContainer')
  private messageContainer!: ElementRef;

  private loginService = inject(LoginService);
  private scrollToBottom: boolean = false;
  private sharedService = inject(SharedService);
  constructor(
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private employerMessageService: EmployerMessageService,
    private cookieService: CookieService,
  ) {}
  getMessageList(): void {
    this.userGuid =
      'YlL9PTBlYTGyY7ZuPQ00ZxOcMRhcBFGyYlJlZiOhYiLzYlL1BFPtBFUwBiJjIGU=';
    if (!this.userGuid) {
      return;
    }

    this.employerMessageService.getMessageList(this.userGuid).subscribe({
      next: (data) => {
        this.messages = data.map((m) => ({
          conversationId: m.conversationId || '',
          jobId: m.jobId,
          companyId: m.companyId,
          jobTitle: m.jobTitle,
          companyLogo: m.companyLogo || 'images/company-placeholder.svg',
          companyName: m.companyName,
          lastMessage: m.lastMessage,
          timeIcon: 'images/time-icon.svg',
          lastChattedOn: m.lastChattedOn,
          unreadMessage: m.unreadMessage,
          isRead: m.isRead,
          mayMessage: true,
          receivedMessages: [],
          isBlockChat: false,
        }));

        this.messages.forEach((msg) => {
          if (!this.sentMessageCounts[msg.conversationId]) {
            this.sentMessageCounts[msg.conversationId] = 0;
          }
        });

        this.cdRef.detectChanges();
      },
      error: (err) => {},
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.loadCareerInfoCookies();
      this._currentAvaileableMessage = this.isProUser ? 5 : 0;
      this.hasReceiverMessage = true;

      this.messages.forEach((msg) => {
        this.sentMessageCounts[msg.conversationId] = 0;
      });
      if (this.hasReceiverMessage) {
        this.messages = this.messages.filter(
          (m) => m.receivedMessages && m.receivedMessages.length > 0,
        );
        this.showMessagesSection = true;
      } else if (this.isProUser) {
        this.showMessagesSection = true;
      }

      this.getMessageList();
    });
  }

  private loadCareerInfoCookies(): void {
    const authData = this.loginService.getAuthData();
    if (authData) {
      this.IsBdjobsPro = authData.isBdjobsPro.toString();
      this.loadSupportingInfo(authData.token);
      return;
    }
    const token = this.cookieService.getCookie('authToken');
    console.log(token+"asdsdasda");
    const rawGuid = this.cookieService.getCookie('MybdjobsGId');
    this.userGuid = rawGuid ? decodeURIComponent(rawGuid) : null;
    this.IsBdjobsPro = this.cookieService.getCookie('IsBdjobsPro') || 'false';

    if (!token || !this.userGuid) {
      return;
    }
   console.log('User Guid:', this.userGuid);
    this.loadSupportingInfo(token);
  }

  private loadSupportingInfo(token: string): void {
    this.sharedService.isLoading.set(true);
    console.log('Loading supporting info with token:', token);
    this.loginService.getSupportingInfo(token).subscribe({
      next: (supportingInfo) => {
        const bdjobsProData =
          supportingInfo?.event?.eventData?.[0]?.value?.currentUser?.bdjobsPro;

        if (bdjobsProData) {
          this.bdjobsProInfo = bdjobsProData;
          this.packageExpired = this.isPackageExpired();
          this.loginService.setAuthData(supportingInfo);
        }

        this.sharedService.isLoading.set(false);
      },
      error: (err) => {
        this.sharedService.isLoading.set(false);
      },
    });
  }

  isPackageExpired(): boolean {
    if (!this.bdjobsProInfo || !this.bdjobsProInfo.packageEnddate) {
      return false;
    }

    const packageEndDate = new Date(this.bdjobsProInfo.packageEnddate);
    const today = new Date();

    return today > packageEndDate;
  }
  openChat(message: Message) {
    this.messages.forEach((m) => (m.isSelected = false));
    message.isSelected = true;
    this.selectedMessage = message;
    this.showChatView = true;

    if (this.isProUser) {
      this.markAsRead(message);
    }

    if (this.userGuid && message.conversationId && message.jobId) {
      this.employerMessageService
        .getMessages({
          DeviceType: 'web',
          UserGuid: this.userGuid,
          JobId: message.jobId.toString(),
          SenderType: 'A',
          ConversationId: Number(message.conversationId),
        })
        .subscribe({
          next: (res) => {
            if (!res || !Array.isArray(res) || res.length === 0) {
              return;
            }

            const responseData = res[0];

            const employerInfoData = responseData.eventData.find(
              (ed) => ed.key === 'EmployerInterestListCommon info ',
            );

            if (
              employerInfoData &&
              employerInfoData.key === 'EmployerInterestListCommon info '
            ) {
              const typedEmployerInfo =
                employerInfoData as EmployerInfoEventData;

              message.jobTitle = typedEmployerInfo.value.jobTitle;

              message.isBlockChat = typedEmployerInfo.value.isBlockChat;
            }

            const chatData = responseData.eventData.find(
              (ed) => ed.key === 'Chat Message ',
            );

            if (chatData && chatData.key === 'Chat Message ') {
              const typedChatData = chatData as ChatMessageEventData;

              message.receivedMessages = typedChatData.value;

              this.selectedMessage.receivedMessages = message.receivedMessages;

              this.sentMessageCounts[message.conversationId] =
                this.countConsecutiveApplicantMessages(
                  this.selectedMessage.receivedMessages,
                );
              this.limitReached[message.conversationId] =
                this.sentMessageCounts[message.conversationId] >= this.max;
              this.scrollToBottom = true;

              this.hasReceiverMessage = message.receivedMessages.length > 0;
            } else {
            }

            this.cdRef.detectChanges();
          },
        });
    }
  }

  get mayMessageCount(): number {
    return this.messages.filter((message) => message.mayMessage).length;
  }

  get currentAvaileableMessage(): number {
    if (!this.isProUser) return 0;
    if (
      this._currentAvaileableMessage === 5 &&
      !this.toastPermanentlyDismissed
    ) {
      this.showUpgradeToast = true;
    }

    return this._currentAvaileableMessage;
  }
  get filteredMessages() {
    let filtered = this.messages;

    switch (this.activeTab) {
      case 'unread':
        filtered = filtered.filter((m) => m.unreadMessage > 0);
        break;
      case 'mayMessage':
        filtered = filtered.filter((m) => m.mayMessage);
        break;
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (m) =>
          m.companyName.toLowerCase().includes(term) ||
          m.lastMessage.toLowerCase().includes(term),
      );
    }

    return filtered;
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
  }

  setActiveTab(tab: 'all' | 'unread' | 'mayMessage') {
    this.activeTab = tab;
  }

  markAsRead(message: Message) {
    message.isRead = true;
    message.unreadMessage = 0;
  }

  onButtonClick(): void {
    this.promoButtonClick.emit();
  }

  onGetProClick(): void {
    this.getProClick.emit();
  }

  showMessages() {
    this.showMessagesSection = true;
    this.goToJobListClick.emit();
  }

  toggleMessages(): void {
    if (!this.isProUser) {
      this.goToJobListClick.emit();
    }
    this.showMessagesSection = true;
  }

  get progressPercentage(): number {
    return Math.min((this.current / this.max) * 100, 100);
  }

  get progressPercentageMessage(): number {
    return Math.min(
      (this.currentAvaileableMessage / this.maxMessage) * 100,
      100,
    );
  }

  get conicGradient(): string {
    const remaining =
      this.max - this.sentMessageCounts[this.selectedMessage?.conversationId];
    const progress = (remaining / this.max) * 100;
    const color = remaining <= 1 ? '#EF4444' : '#17B26A';
    return `conic-gradient(${color} ${progress}%, transparent 0%)`;
  }

  get isEmptyInbox(): boolean {
    return this.filteredMessages.length === 0 && this.showMessagesSection;
  }

  get conicGradientMessage(): string {
    const progress = this.progressPercentageMessage;
    const color = this.currentAvaileableMessage <= 5 ? '#EF4444' : '#17B26A';
    return `conic-gradient(${color} ${progress}%, transparent 0%)`;
  }

  formatNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }

  formatMessageNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }
  public getRelativeTime(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) {
      return `just now`;
    }

    if (diffMins < 60) {
      return `${diffMins} min`;
    }

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hour`;
    }

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
      return `${diffDays} day`;
    }

    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks} week`;
  }

  onMessageChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.currentMessage = target.value;
    this.messageChange.emit(target.value);
  }
  private countConsecutiveApplicantMessages(messages: ChatMessage[]): number {
    let count = 0;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].textSenderType === 'A') {
        count++;
        if (count === 3) {
          break;
        }
      } else {
        break;
      }
    }
    return count;
  }
  sentMessages: {
    [key: string]: Array<{
      text: string;
      time: string;
      isRead: boolean;
    }>;
  } = {};

  onSendMessage(): void {
    if (!this.currentMessage.trim() || !this.selectedMessage) {
      return;
    }

    const messageId = this.selectedMessage.conversationId;

    if (this.sentMessageCounts[messageId] >= 3) {
      alert('You have reached your maximum reply limit for this conversation.');
      return;
    }

    const sendMessageRequest: SendMessageRequest = {
      userGuid: this.userGuid || '',
      deviceType: 'web',
      conversationId: Number(messageId),
      employerProfileId: 0,
      jobId: Number(this.selectedMessage.jobId) || 0,
      senderType: 'A',
      message: this.currentMessage,
      companyName: this.selectedMessage.companyName || '',
    };

    this.employerMessageService.sendMessage(sendMessageRequest).subscribe({
      next: (response) => {
        if (!this.sentMessages[messageId]) {
          this.sentMessages[messageId] = [];
        }

        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const formattedDate = now.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });

        this.sentMessages[messageId].push({
          text: this.currentMessage,
          time: formattedTime,
          isRead: false,
        });

        this.selectedMessage.receivedMessages =
          this.selectedMessage.receivedMessages || [];
        this.selectedMessage.receivedMessages.push({
          textId: 0,
          text: this.currentMessage,
          textSenderType: 'A',
          cnvId: Number(messageId),
          textReadDate: '',
          textReadTime: '',
          textSendDate: formattedDate,
          textSendTime: formattedTime,
          employeeEmail: '',
          personalEmail: null,
          textSendBy: null,
        });

        this.selectedMessage.lastMessage = this.currentMessage;
        this.selectedMessage.lastChattedOn = new Date().toISOString();

        this.sentMessageCounts[messageId] =
          this.countConsecutiveApplicantMessages(
            this.selectedMessage.receivedMessages,
          );
        this.limitReached[messageId] =
          this.sentMessageCounts[messageId] >= this.max;
        this.currentMessage = '';

        if (this.isProUser) {
          this._currentAvaileableMessage--;
          if (
            this._currentAvaileableMessage === 5 &&
            !this.toastPermanentlyDismissed
          ) {
            this.showUpgradeToast = true;
          }
        }

        this.scrollToBottom = true;

        this.cdRef.detectChanges();
      },
      error: (err) => {
        alert('Failed to send your message. Please try again.');
      },
    });
  }

  canReply(messageId: string): boolean {
    if (!messageId) {
      return true;
    }

    const messages = this.selectedMessage?.receivedMessages || [];
    const consecutive = this.countConsecutiveApplicantMessages(messages);
    this.sentMessageCounts[messageId] = consecutive;
    return consecutive < 3;
  }
  shouldShowLimitNotice(messageId: string): boolean {
    if (!messageId) {
      return false;
    }
    return (
      this.limitReached[messageId] === true &&
      this.sentMessageCounts[messageId] < this.max
    );
  }

  goBack(): void {
    this.showChatView = false;
    this.selectedMessage = null;
    this.cdRef.detectChanges();
  }

  dismissToast(): void {
    this.toastPermanentlyDismissed = true;
    this.showUpgradeToast = false;
    this.cdRef.detectChanges();
  }

  upgradeNow(): void {
    window.open(
      'https://mybdjobs.bdjobs.com/bdjobs-pro/bdjobs-pro-package-pricing',
      '_blank',
    );
  }

  private scrollToBottomOfChat(): void {
    try {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  ngAfterViewChecked(): void {
    if (this.scrollToBottom) {
      this.scrollToBottomOfChat();
      this.scrollToBottom = false;
    }
  }
}

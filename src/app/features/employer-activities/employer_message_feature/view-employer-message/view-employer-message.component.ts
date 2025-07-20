import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Message } from '../../../../shared/models/models';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployerMessageService } from '../services/employer-message.service';
import { CookieService } from '../../../../core/services/cookie/cookie.service';


@Component({
  selector: 'app-view-employer-message',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-employer-message.component.html',
  styleUrl: './view-employer-message.component.scss'
})
export class ViewEmployerMessageComponent {
  @Input() headerTitle: string = 'View Employer Message';
  @Input() headerSubtitle: string = 'Read the latest communication from your employer';
  @Input() headerButtonText: string = 'Get bdjobs pro';
  @Input() upgradeNowButtonText: string = 'Upgrade Plan';
  @Input() badgeMessage: string = 'Message Left';
  @Input() badgeIconSrc: string = 'images/reviewhelp-circle.svg';
  @Input() progressValue: string = '00';
  @Input() emptyStateTitle: string = "You Don't Have Any Messages Yet";
  @Input() emptyStateDescription: string = "You haven't applied to any jobs yet. Once you apply, you'll be able to message the";
  @Input() emptyStateAdditionalText: string = "employer directly if you have a";
  @Input() emptyStateSubscriptionText: string = "subscription.";
  @Input() emptyStateButtonText: string = "Go to Job List";
  @Input() emptyStateIllustrationSrc: string = "images/eployermessagelanding.svg";
  @Input() emptyStateIllustrationSrcPro: string = "images/proemptyinbox.svg";
  @Input() emptyStateBadgeSrc: string = "images/Bdjobs Pro 1.svg";
  @Input() emptyStateButtonIconSrc: string = "images/arrow-right.svg";
  @Output() getProClick = new EventEmitter<void>();
  @Output() goToJobListClick = new EventEmitter<void>();
  @Input() logoUrl: string = 'images/Bdjobs Pro 1.svg';
  @Input() logoAltText: string = 'Frame';
  @Input() promoText: string = "Subscription use 'You May Message' feature. Unlock now!";
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
  @Input() description: string = 'You can send up to 3 messages at a time. If the employer replies to your message, your messaging feature will be activated again. Please wait for their response.';
  @Input() ariaLabel: string = 'Error alert notification';
  private _currentAvaileableMessage: number = 30;
  activeTab: 'all' | 'unread' | 'mayMessage' = 'all';
  showMessagesSection = false;
  selectedMessage: any = null;
  showChatView = false;
  searchTerm: string = '';
  isProUser: boolean = false;
  hideProgressRing: boolean = false;
  showUpgradeToast: boolean = false;
  toastShown: boolean = false;
  userGuid: string | null = null;
  sentMessageCounts: { [key: string]: number } = {};
  messages: Message[] = [
    {
      id: '1',
      avatar: 'images/jatri-logo.svg',
      name: 'Jatri',
      message: 'Sent you a message in "UI UX Designer" role.',
      timeIcon: 'images/time-icon.svg',
      timeText: '3 hour',
      unreadCount: 2,
      isRead: false,
      mayMessage: true,
      receivedMessages: [
        {
          text: 'Hello, we are interested in your profile for the UI UX Designer position.',
          time: '10:30 am',
          date: 'Today'
        }
      ]
    },
    {
      id: '2',
      avatar: 'images/jatri-logo.svg',
      name: 'ACME',
      message: 'Sent you a message in "Software Engineer" role.',
      timeIcon: 'images/time-icon.svg',
      timeText: '2 day',
      unreadCount: 0,
      isRead: true,
      mayMessage: false,
      receivedMessages: [
        {
          text: 'Hello, we are interested in your profile for the UI UX Designer position.',
          time: '10:30 am',
          date: 'Today'
        }
      ]
    },
    {
      id: '3',
      avatar: 'images/jatri-logo.svg',
      name: 'Lightbox',
      message: 'Sent you a message in "Software Engineer" role.',
      timeIcon: 'images/time-icon.svg',
      timeText: '1 hour',
      hasBorder: true,
      unreadCount: 1,
      isRead: false,
      mayMessage: true,
      receivedMessages: [
        {
          text: 'Hello, we are interested in your profile for the UI UX Designer position.',
          time: '10:30 am',
          date: 'Today'
        }
      ]
    },
    {
      id: '4',
      avatar: 'images/jatri-logo.svg',
      name: 'Lightbox',
      message: 'Sent you a message in "Software Engineer" role.',
      timeIcon: 'images/time-icon.svg',
      timeText: '1 hour',
      hasBorder: true,
      unreadCount: 0,
      isRead: true,
      mayMessage: true,
      receivedMessages: [
        {
          text: 'Hello, we are interested in your profile for the UI UX Designer position.',
          time: '10:30 am',
          date: 'Today'
        }
      ]
    },
    {
      id: '5',
      avatar: 'images/jatri-logo.svg',
      name: 'Luminous',
      message: 'Sent you a message in "Front End Developer" role.',
      timeIcon: 'images/time-icon.svg',
      timeText: '5 week',
      hasBorder: true,
      unreadCount: 3,
      isRead: false,
      mayMessage: false,
      receivedMessages: [
        {
          text: 'Hello, we are interested in your profile for the UI UX Designer position.',
          time: '10:30 am',
          date: 'Today'
        }
      ]
    },
    {
      id: '6',
      avatar: 'images/jatri-logo.svg',
      name: 'Luminous',
      message: 'Sent you a message in "Front End Developer" role.',
      timeIcon: 'images/time-icon.svg',
      timeText: '5 week',
      hasBorder: true,
      unreadCount: 3,
      isRead: false,
      mayMessage: false,
      receivedMessages: [
        {
          text: 'Hello, we are interested in your profile for the UI UX Designer position.',
          time: '10:30 am',
          date: 'Today'
        }
      ]
    },
    {
      id: '7',
      avatar: 'images/jatri-logo.svg',
      name: 'Luminous',
      message: 'Sent you a message in "Front End Developer" role.',
      timeIcon: 'images/time-icon.svg',
      timeText: '5 week',
      hasBorder: true,
      unreadCount: 3,
      isRead: false,
      mayMessage: false,
      receivedMessages: [
        {
          text: 'Hello, we are interested in your profile for the UI UX Designer position.',
          time: '10:30 am',
          date: 'Today'
        }
      ]
    }
  ];


  allmessages: Message[] = [];
  hasMessagesFromEmployer: boolean = false;
  hasReceiverMessage: boolean = true;
  toastPermanentlyDismissed: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private employerMessageService: EmployerMessageService,
    private cookieService: CookieService
  ) { }
  getMessageList(): void {
    this.userGuid = "ZiZuPid0ZRLyZ7S3YQ00PRg7MRgwPELyBTYxPRLzZESuYTU0BFPtBFVUIGL3Ung=";
    if (!this.userGuid) {
      console.warn('User GUID not found');
      return;
    }

    this.employerMessageService.getMessageList(this.userGuid).subscribe({
      next: (data) => {
        this.messages = data.map(m => ({
          id: m.conversationId || '',
          jobId: m.jobId,
          avatar: m.companyLogo,
          name: m.companyName,
          message: m.lastMessage,
          timeIcon: 'images/time-icon.svg',
          timeText: m.lastChattedOn,
          unreadCount: m.unreadMessage,
          isRead: m.isRead,
          mayMessage: true,
          receivedMessages: []
        }));

        this.messages.forEach(msg => {
          if (!this.sentMessageCounts[msg.id]) {
            this.sentMessageCounts[msg.id] = 0;
          }
        });

        this.cdRef.detectChanges();
      },
      error: err => {
        console.error('Error loading message list', err);
      }
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isProUser = params['bdjobsuser'] === 'pro';
      this._currentAvaileableMessage = this.isProUser ? 5 : 0;
      this.userGuid = "ZiZuPid0ZRLyZ7S3YQ00PRg7MRgwPELyBTYxPRLzZESuYTU0BFPtBFVUIGL3Ung=";
      this.hasReceiverMessage = params['receivermessage'] !== '0';

      this.messages.forEach(msg => {
        this.sentMessageCounts[msg.id] = 0;
      });
      if (this.hasReceiverMessage) {
        this.messages = this.messages.filter(m => m.receivedMessages && m.receivedMessages.length > 0);
        this.showMessagesSection = true;
      } else if (this.isProUser) {
        this.showMessagesSection = true;
      }

      this.getMessageList();
    });
  }


  openChat(message: Message) {
    this.messages.forEach(m => m.isSelected = false);
    message.isSelected = true;
    this.selectedMessage = message;
    this.showChatView = true;
    if (this.isProUser) {
      this.markAsRead(message);
    }
     if (this.userGuid && message.id && message.jobId) {
      this.employerMessageService.getMessages({
        DeviceType: 'web',
        UserGuid: this.userGuid,
        JobId: message.jobId.toString(),
        SenderType: 'A',
        ConversationId: Number(message.id)
      }).subscribe({
        next: res => {
          const chatData = res.eventData.find(ed => ed.key.trim() === 'Chat Message');
          if (chatData && Array.isArray(chatData.value)) {
            message.receivedMessages = chatData.value.map((m: any) => ({
              text: m.text,
              time: m.textSendTime,
              date: m.textSendDate
            }));
          }
          this.cdRef.detectChanges();
        },
        error: err => console.error('Error loading messages', err)
      });
    }
  }

  get mayMessageCount(): number {
    return this.messages.filter(message => message.mayMessage).length;
  }

  get currentAvaileableMessage(): number {
    if (!this.isProUser) return 0;
    if (this._currentAvaileableMessage === 5 && !this.toastPermanentlyDismissed) {
      this.showUpgradeToast = true;
    }

    return this._currentAvaileableMessage;
  }
  get filteredMessages() {
    let filtered = this.messages;

    switch (this.activeTab) {
      case 'unread':
        filtered = filtered.filter(m => m.unreadCount > 0);
        break;
      case 'mayMessage':
        filtered = filtered.filter(m => m.mayMessage);
        break;
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(term) ||
        m.message.toLowerCase().includes(term)
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

  markAsRead(message: any) {
    message.isRead = true;
    message.unreadCount = 0;
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
    return Math.min((this.currentAvaileableMessage / this.maxMessage) * 100, 100);
  }

  get conicGradient(): string {
    const remaining = this.max - this.sentMessageCounts[this.selectedMessage?.id];
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

  sentMessages: {
    [key: string]: Array<{
      text: string;
      time: string;
      isRead: boolean;
    }>
  } = {};


  onSendMessage(): void {
    if (this.currentMessage.trim() && this.selectedMessage) {
      const messageId = this.selectedMessage.id;
      if (this.sentMessageCounts[messageId] >= 3) {
        alert('You have reached your maximum reply limit for this conversation.');
        return;
      }
      if (!this.sentMessages[messageId]) {
        this.sentMessages[messageId] = [];
      }

      this.sentMessages[messageId].push({
        text: this.currentMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: this.selectedMessage?.isRead ?? false
      });


      this.sentMessageCounts[messageId]++;
      this.sendMessage.emit();
      this.currentMessage = '';

      if (this.isProUser) {
        this._currentAvaileableMessage--;
      }
    }
  }


  canReply(messageId: string): boolean {
    return this.sentMessageCounts[messageId] < 3;
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
    this.toastPermanentlyDismissed = true;
    this.showUpgradeToast = false;
    this.cdRef.detectChanges();
    this.getProClick.emit();
  }




}

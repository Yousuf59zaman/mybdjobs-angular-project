import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, AfterViewChecked, Input, Output, ViewChild } from '@angular/core';
import { Message } from '../../../../shared/models/models';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployerMessageService } from '../services/employer-message.service';
import { CookieService } from '../../../../core/services/cookie/cookie.service';
import { ChatMessage, ChatMessageEventData, EmployerInfoEventData, SendMessageRequest } from '../models/employer-message';


@Component({
  selector: 'app-view-employer-message',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-employer-message.component.html',
  styleUrl: './view-employer-message.component.scss'
})
export class ViewEmployerMessageComponent implements AfterViewChecked {
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
  messages: Message[] = [];


  allmessages: Message[] = [];
  hasMessagesFromEmployer: boolean = false;
  hasReceiverMessage: boolean = true;
  toastPermanentlyDismissed: boolean = false;


  @ViewChild('messageContainer')
  private messageContainer!: ElementRef;
  private scrollToBottom: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private employerMessageService: EmployerMessageService,
    private cookieService: CookieService
  ) { }
  getMessageList(): void {
    this.userGuid = "YlL9PTBlYTGyY7ZuPQ00ZxOcMRhcBFGyYlJlZiOhYiLzYlL1BFPtBFUwBiJjIGU=";
    if (!this.userGuid) {
      console.warn('User GUID not found');
      return;
    }

    this.employerMessageService.getMessageList(this.userGuid).subscribe({
      next: (data) => {
        this.messages = data.map(m => ({
          conversationId: m.conversationId || '',
          jobId: m.jobId,
          companyId: m.companyId, // Make sure to include the company ID
          jobTitle: m.jobTitle,
          companyLogo: m.companyLogo || 'images/company-placeholder.svg', // Default avatar
          companyName: m.companyName,
          lastMessage: m.lastMessage,
          timeIcon: 'images/time-icon.svg',
          lastChattedOn: m.lastChattedOn,
          unreadMessage: m.unreadMessage,
          isRead: m.isRead,
          mayMessage: true,
          receivedMessages: [],
          isBlockChat: false
        }));

        this.messages.forEach(msg => {
          if (!this.sentMessageCounts[msg.conversationId]) {
            this.sentMessageCounts[msg.conversationId] = 0;
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
        this.sentMessageCounts[msg.conversationId] = 0;
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
    console.log('Selected message:', this.selectedMessage);
    this.showChatView = true;

    if (this.isProUser) {
      this.markAsRead(message);
    }

    if (this.userGuid && message.conversationId && message.jobId) {
      console.log('Fetching messages for conversation:', message.conversationId);

      this.employerMessageService.getMessages({
        DeviceType: 'web',
        UserGuid: this.userGuid,
        JobId: message.jobId.toString(),
        SenderType: 'A',
        ConversationId: Number(message.conversationId)
      }).subscribe({
        next: (res) => {
          console.log('Chat response received:', res);

          if (!res || !Array.isArray(res) || res.length === 0) {
            console.warn('Empty or invalid response:', res);
            return;
          }

          // Extract the first response item
          const responseData = res[0];
          console.log('Processing response data:', responseData);

          // Look for employer info
          const employerInfoData = responseData.eventData.find(
            ed => ed.key === "EmployerInterestListCommon info "
          );

          if (employerInfoData && employerInfoData.key === "EmployerInterestListCommon info ") {
            // Type assertion to help TypeScript understand the discriminated union
            const typedEmployerInfo = employerInfoData as EmployerInfoEventData;
            console.log('Found employer info:', typedEmployerInfo.value);

            // Update job title from employer info
            message.jobTitle = typedEmployerInfo.value.jobTitle;
            // store chat blocking flag
            message.isBlockChat = typedEmployerInfo.value.isBlockChat;
            console.log('Updated job title:', message.jobTitle);
          }

          // Look for chat messages
          const chatData = responseData.eventData.find(
            ed => ed.key === "Chat Message "
          );

          if (chatData && chatData.key === "Chat Message ") {
            // Type assertion for chat messages
            const typedChatData = chatData as ChatMessageEventData;
            console.log('Found chat messages:', typedChatData.value.length);

            // No need to map - the types should match already
            message.receivedMessages = typedChatData.value;

            this.selectedMessage.receivedMessages = message.receivedMessages;
            console.log('Received messages set:', this.selectedMessage.receivedMessages);
            // Update consecutive applicant message count for this conversation
            this.sentMessageCounts[message.conversationId] =
              this.countConsecutiveApplicantMessages(this.selectedMessage.receivedMessages);
            // Set flag to scroll to bottom
            this.scrollToBottom = true;

            // Force UI update
            this.hasReceiverMessage = message.receivedMessages.length > 0;
          } else {
            console.warn('No chat messages found in response');
          }

          this.cdRef.detectChanges();
        },
        error: err => console.error('Error loading messages:', err)
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
        filtered = filtered.filter(m => m.unreadMessage > 0);
        break;
      case 'mayMessage':
        filtered = filtered.filter(m => m.mayMessage);
        break;
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(m =>
        m.companyName.toLowerCase().includes(term) ||
        m.lastMessage.toLowerCase().includes(term)
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
    return Math.min((this.currentAvaileableMessage / this.maxMessage) * 100, 100);
  }

  get conicGradient(): string {
    const remaining = this.max - this.sentMessageCounts[this.selectedMessage?.conversationId];
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
    }>
  } = {};


  onSendMessage(): void {
    console.log('Attempting to send message:', this.currentMessage);

    if (!this.currentMessage.trim() || !this.selectedMessage) {
      console.log('Empty message or no selected message - aborting');
      return;
    }

    const messageId = this.selectedMessage.conversationId;

    // Check message limit
    if (this.sentMessageCounts[messageId] >= 3) {
      console.log('Message limit reached for this conversation');
      alert('You have reached your maximum reply limit for this conversation.');
      return;
    }

    // Log selected message details for debugging
    console.log('Selected message details:', {
      conversationId: messageId,
      companyId: this.selectedMessage.companyId,
      jobId: this.selectedMessage.jobId,
      companyName: this.selectedMessage.companyName
    });

    // Create request object
    const sendMessageRequest: SendMessageRequest = {
      userGuid: this.userGuid || '',
      deviceType: 'web',
      conversationId: Number(messageId),
      employerProfileId: 0,
      jobId: Number(this.selectedMessage.jobId) || 0,
      senderType: 'A', // A for Applicant
      message: this.currentMessage,
      companyName: this.selectedMessage.companyName || ''
    };

    // Call API service to send message
    this.employerMessageService.sendMessage(sendMessageRequest).subscribe({
      next: (response) => {
        console.log('✅ Message sent successfully:', response);

        // Initialize message array if needed
        if (!this.sentMessages[messageId]) {
          this.sentMessages[messageId] = [];
        }

        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formattedDate = now.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });

        // Add to local sent messages for UI tracking
        this.sentMessages[messageId].push({
          text: this.currentMessage,
          time: formattedTime,
          isRead: false
        });

        // Add to chat display in the UI
        this.selectedMessage.receivedMessages = this.selectedMessage.receivedMessages || [];
        this.selectedMessage.receivedMessages.push({
          textId: 0, // Temporary ID until refresh
          text: this.currentMessage,
          textSenderType: 'A',
          cnvId: Number(messageId),
          textReadDate: '',
          textReadTime: '',
          textSendDate: formattedDate,
          textSendTime: formattedTime,
          employeeEmail: '',
          personalEmail: null,
          textSendBy: null
        });

        // Update message metadata
        this.selectedMessage.lastMessage = this.currentMessage;
        this.selectedMessage.lastChattedOn = new Date().toISOString();


        // Update message count based on consecutive applicant messages
        this.sentMessageCounts[messageId] = this.countConsecutiveApplicantMessages(
          this.selectedMessage.receivedMessages
        );
        // Clear input field
        this.currentMessage = '';

        // Handle pro user message count
        if (this.isProUser) {
          this._currentAvaileableMessage--;
          if (this._currentAvaileableMessage === 5 && !this.toastPermanentlyDismissed) {
            this.showUpgradeToast = true;
          }
        }

        // After message is sent and added to UI
        this.scrollToBottom = true;

        // Force UI update
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error sending message:', err);
        alert('Failed to send your message. Please try again.');
      }
    });
  }


  canReply(messageId: string): boolean {
    console.log("asdsad ", this.sentMessageCounts[messageId]);
    if (!messageId) {
      return true;
    }

    const messages = this.selectedMessage?.receivedMessages || [];
    const consecutive = this.countConsecutiveApplicantMessages(messages);
    this.sentMessageCounts[messageId] = consecutive;
    console.log('Consecutive messages for', messageId, ':', consecutive);
    return consecutive < 3;
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

  // Add this method to scroll to bottom of chat
  private scrollToBottomOfChat(): void {
    try {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  // Implement AfterViewChecked to scroll after view is initialized/updated
  ngAfterViewChecked(): void {
    if (this.scrollToBottom) {
      this.scrollToBottomOfChat();
      this.scrollToBottom = false;
    }
  }
}

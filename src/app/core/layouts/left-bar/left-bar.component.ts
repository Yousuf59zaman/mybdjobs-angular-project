import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { provideTranslocoScope, TranslocoDirective, TranslocoModule } from '@jsverse/transloco';


interface AccordionItem {
  id: string;
  title: string;
  isActive: boolean;
  items: {
    text: string;
    iconClass: string;
    link: string;
    badge?: {
      text: string;
      color: string;
      bgColor?: string;
      position: string;
      borderColor?: string;
    };
    subText?: string;
  }[];
  hasNotification?: boolean;
  customBadge?: {
    text: string;
    position: string;
    color: string;
    borderColor: string;
  };
}
@Component({
  selector: 'app-left-bar',
  standalone: true,
  imports : [ CommonModule,TranslocoModule,TranslocoDirective],
  providers: [provideTranslocoScope('leftbar')],
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.scss']
})
export class LeftBarComponent {

  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Input() sidebarItems: AccordionItem[] = [
    {
      id: 'hs-basic-with-arrow-heading-one',
      title: 'manageProfile',
      isActive: true,
      items: [
        { text: 'viewProfile', iconClass: 'icon-view-resume',link: 'https://mybdjobs.bdjobs.com/mybdjobs/masterview.asp' },
        { text: 'dashboard', iconClass: 'icon-view-dashboard',link: 'https://mybdjobs.bdjobs.com/mybdjobs/resume-dashboard.asp' },
        { text: 'editProfile', iconClass: 'icon-file',link: 'https://mybdjobs.bdjobs.com/new_mybdjobs/step_01_view.asp' },
        { 
          text: 'videoCv', 
          iconClass: 'icon-vdeo-resume',
          link: 'https://mybdjobs.bdjobs.com/mybdjobs/videoResume/video_resume_home.asp'
        },
        { text: 'customCv', iconClass: 'icon-ownformat-resume',link: 'https://mybdjobs.bdjobs.com/mybdjobs/file_upload.asp'},
        { text: 'emailedCv', iconClass: 'icon-send-email',link:'https://mybdjobs.bdjobs.com/mybdjobs/mail_form.asp' }
      ]
    },
    {
      id: 'hs-basic-with-arrow-heading-two',
      title: 'invitation',
      isActive: false,
      hasNotification: true,
      items: [
        { 
          text: 'liveInterview', 
          iconClass: 'icon-live-video',
          link: 'https://mybdjobs.bdjobs.com/mybdjobs/invite-interview-home.asp?i=2',
          badge: {
            text: 'beta',
            color: '#000',
            bgColor: '#fbc02d',
            position: 'translate-x-2 translate-y+2'
          }
        },
        { 
          text: 'videoInterview',
          iconClass: 'icon-video-camera',
          subText: '(Recorded)',
          link: 'https://mybdjobs.bdjobs.com/mybdjobs/invite-interview-home.asp?i=1',
        },
        { text: 'generalInterview', iconClass: 'icon-job-offer',link: 'https://mybdjobs.bdjobs.com/mybdjobs/invite-interview-home.asp?i=0' },
        { 
          text: 'onlineTest', 
          iconClass: 'icon-onlinetest',
          link: 'https://mybdjobs.bdjobs.com/mybdjobs/invite-interview-home.asp?i=4',
          badge: {
            text: 'beta',
            color: '#000',
            bgColor: '#fbc02d',
            position: 'translate-x-2 translate-y+2'
          }
        },
        { 
          text: 'voiceTest', 
          iconClass: 'icon-ai-audio iaudio',
          subText: '(voice based)',
          link: 'https://mybdjobs.bdjobs.com/mybdjobs/invite-interview-home.asp?i=6',
          badge: {
            text: '6',
            color: 'white',
            bgColor: '#b3003c',
            borderColor: '#B3003C',
            position: 'translate-x-3 translate-y-0'
          }
        }
      ]
    },
    {
      id: 'hs-basic-with-arrow-heading-three',
      title: 'myActivities',
      isActive: false,
      items: [
        { text: 'appliedJobs', iconClass: 'icon-applied',link: 'https://mybdjobs.bdjobs.com/mybdjobs/apply_position.asp', },
        { text: 'emailedResume', iconClass: 'icon-emailed-resume',link: 'https://mybdjobs.bdjobs.com/mybdjobs/resume_Email.asp', },
        { text: 'shortlistedJob', iconClass: 'icon-star',link: 'https://mybdjobs.bdjobs.com/mybdjobs/show_cart.asp', },
        { text: 'followingEmployer', iconClass: 'icon-building-plus',link: 'https://mybdjobs.bdjobs.com/mybdjobs/Emp_Followed.asp', },
        { text: 'transactionOverview', iconClass: 'icon-transaction-history',link: 'https://mybdjobs.bdjobs.com/payment/payment-statement.asp', }
      ]
    },
    {
      id: 'hs-basic-with-arrow-heading-four',
      title: 'pointsRewards',
      isActive: false,
      
      items: [
        { text: 'myPoints', iconClass: 'icon-credit-point-system',link: 'https://mybdjobs.bdjobs.com/mybdjobs/point-dashboard.asp', },
        { text: 'howToEarnPoints', iconClass: 'icon-question',link: 'https://mybdjobs.bdjobs.com/mybdjobs/user-guide-point-system.asp', }
      ]
    },
    {
      id: 'hs-basic-with-arrow-heading-five',
      title: 'employerActivities',
      isActive: false,
      items: [
        { text: 'viewedCv', iconClass: 'icon-view-resume',link: 'https://mybdjobs.bdjobs.com/mybdjobs/resume_view.asp', },
        { text: 'employerMessage', iconClass: 'icon-message',link: 'https://mybdjobs.bdjobs.com/mybdjobs/employer-message.asp', },
        { text: 'employerInterested', iconClass: 'icon-employer-interest',link: 'https://mybdjobs.bdjobs.com/mybdjobs/employer_interest_list.asp', }
      ]
    },
    {
      id: 'hs-basic-with-arrow-heading-six',
      title: 'personalization',
      isActive: false,
      items: [
        { text: 'favouriteSearch', iconClass: 'icon-heart-o',link: 'https://mybdjobs.bdjobs.com/mybdjobs/favouritesearch.asp', },
        { text: 'smsJobAlert', iconClass: 'icon-sms-package-service',link: 'https://mybdjobs.bdjobs.com/mybdjobs/sms/sms-service.asp', },
        { text: 'myTrainings', iconClass: 'icon-training',link: 'https://mybdjobs.bdjobs.com/mybdjobs/my_bdjobs_training_list.asp', }
      ]
    }
  ];

  toggleAccordion(item: AccordionItem): void {
    item.isActive = !item.isActive;
  }
  onCloseClick() {
    this.close.emit();
  }
 
}

export interface AccordionItem {
  id: string;
  title: string;
  isActive: boolean;
  icon: string;
  items: AccordionChild[];
  routeLink?: string;
  hasNotification?: boolean;
  customBadge?: BadgeModel;
}

export interface AccordionChild {
  title: string;
  iconClass: string;
  isSelected: boolean;
  link: string;
  badge?: BadgeModel;
  subText?: string;
}

export interface BadgeModel {
  text: string;
  color: string;
  position: string;
  bgColor?: string;
  borderColor?: string;
}

export const MainMenuItems: AccordionItem[] = [
  //main menu items
  {
    id: 'main-dashboard',
    title: 'Dashboard',
    isActive: true,
    items: [],
    icon: 'icon-view-dashboard',
    routeLink: '/dashboard'
  },
  {
    id: 'main-manageProfile',
    title: 'Manage Profile',
    isActive: false,
    items: [
      {
        title: 'View Profile',
        iconClass: 'icon-view-resume',
        link: '/view-resume',
        isSelected: false
      },
      {
        title: 'Edit Bdjobs Profile',
        iconClass: 'icon-view-resume',
        link: '/edit-profile',
        isSelected: false
      },
      {
        title: 'Video CV',
        iconClass: 'icon-vdeo-resume',
        link: '#',
        isSelected: false
      },
      {
        title: 'Customized CV',
        iconClass: 'icon-ownformat-resume',
        link: '#',
        isSelected: false
      },
      {
        title: 'Email CV',
        iconClass: 'icon-send-email',
        link: '/email-cv',
        isSelected: false
      },
    ],
    icon: 'icon-ProfilePreference1',
    routeLink: '#'
  },
  {
    id: 'main-invitations',
    title: 'Invitations',
    isActive: false,
    items: [
      {
        title: 'Video Interview Recorded',
        iconClass: 'icon-view-resume',
        link: '/#',
        isSelected: false
      },
      {
        title: 'General Interview',
        iconClass: 'icon-view-resume',
        link: '/#',
        isSelected: false
      },
      {
        title: 'Online Test',
        iconClass: 'icon-vdeo-resume',
        link: '#',
        isSelected: false
      },
      {
        title: 'Personality Test  by Voice',
        iconClass: 'icon-ownformat-resume',
        link: '#',
        isSelected: false
      },
    ],
    icon: 'icon-ProfilePreference1',
  },
  {
    id: 'main-myActivities',
    title: 'My Activities',
    isActive: false,
    items: [
      {
        title: 'Applied Jobs',
        iconClass: 'icon-view-resume',
        link: '/#',
        isSelected: false
      },
      {
        title: 'Emailed Resume',
        iconClass: 'icon-view-resume',
        link: '/resume-email',
        isSelected: false
      },
      {
        title: 'Shortlisted Jobs',
        iconClass: 'icon-vdeo-resume',
        link: '/show_cart',
        isSelected: false
      },
      {
        title: 'Following Employer',
        iconClass: 'icon-ownformat-resume',
        link: '#',
        isSelected: false
      },
      {
        title: 'Transaction Overview',
        iconClass: 'icon-send-email',
        link: '/#',
        isSelected: false
      },
    ],
    icon: 'icon-ProfilePreference1',
    routeLink: '#'
  },
  {
    id: 'main-pointsRewards',
    title: 'Points & Rewards',
    isActive: false,
    items: [
      {
        title: 'My Points',
        iconClass: 'icon-view-resume',
        link: '/point-reward',
        isSelected: false
      },
      {
        title: 'How do I earn Points',
        iconClass: 'icon-view-resume',
        link: '/#',
        isSelected: false
      },
    ],
    icon: 'icon-ProfilePreference1',
  },
  {
    id: 'main-employerActivities',
    title: 'Employer Activities',
    isActive: false,
    items: [
      {
        title: 'Employer Viewed CV',
        iconClass: 'icon-view-resume',
        link: '/employer-viewed-cv',
        isSelected: false
      },
      {
        title: 'Employer Message',
        iconClass: 'icon-view-resume',
        link: '/employer-message',
        isSelected: false
      },
      {
        title: 'Employer Interested',
        iconClass: 'icon-vdeo-resume',
        link: '/employer_interest',
        isSelected: false
      },
    ],
    icon: 'icon-ProfilePreference1',
  },
  {
    id: 'main-personalization',
    title: 'Personalization',
    isActive: false,
    items: [
      {
        title: 'Favourite Search',
        iconClass: 'icon-view-resume',
        link: '/favouritesearch',
        isSelected: false
      },
      {
        title: 'SMS Job Alert',
        iconClass: 'icon-view-resume',
        link: '/#',
        isSelected: false
      },
    ],
    icon: 'icon-ProfilePreference1',
  },
  // personal hiring items
  {
    id: 'ph-postJob',
    title: 'Post New Job',
    isActive: false,
    items: [],
    icon: 'icon-view-dashboard',
    routeLink: '#'
  },
  {
    id: 'ph-dashboard',
    title: 'Dashboard',
    isActive: false,
    items: [],
    icon: 'icon-view-dashboard',
    routeLink: '#'
  },
  {
    id: 'ph-help',
    title: 'Help',
    isActive: false,
    items: [],
    icon: 'icon-view-dashboard',
    routeLink: '#'
  },
  //account itmes
  {
    id: 'acc-settings',
    title: 'Account Settings',
    isActive: false,
    items: [],
    icon: 'icon-view-dashboard',
    routeLink: '/account-settings'
  },
  {
    id: 'acc-helpVid',
    title: 'Help Video',
    isActive: false,
    items: [],
    icon: 'icon-view-dashboard',
    routeLink: '#'
  },
  {
    id: 'acc-signOut',
    title: 'Sign Out',
    isActive: false,
    items: [],
    icon: 'icon-view-dashboard',
    routeLink: '#'
  },
]
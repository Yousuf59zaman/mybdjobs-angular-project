import { NgClass } from '@angular/common';
import { Component, computed, effect, ElementRef, EventEmitter, HostListener, inject, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { provideTranslocoScope, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-nav-home',
  imports: [NgClass],
  templateUrl: './nav-home.component.html',
  providers: [provideTranslocoScope('nav')],
  styleUrl: './nav-home.component.scss'
})
export class NavHomeComponent {
  readonly isMenuOpen = signal(false);
  isJobItemShow = signal(false);
  isJobItemShowSmall = signal(false);
  isMybdjobsItemShow = signal(false);
  private elref = inject(ElementRef)
  constructor(private translocoService: TranslocoService) {
    this.setUrlBasedOnLanguage(translocoService.getActiveLang());
    effect(() => {
      if (this.isJobItemShow()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  jobsItem = [
    {
      imageUrl: 'gen-search.svg',
      title: 'General Search',
      url: 'https://jobs.bdjobs.com/jobsearch.asp',
      bnUrl: 'https://jobs.bdjobs.com/bn/jobsearchbn.asp',
      bnTitle: 'সাধারণ খোঁজ'
    },
    {
      imageUrl: 'early-access.svg',
      title: 'Early Access Jobs',
      url: 'https://jobs.bdjobs.com/jobsearch.asp',
      bnUrl: 'https://jobs.bdjobs.com/bn/jobsearchbn.asp',
      bnTitle: 'প্রাথমিক অ্যাক্সেস'
    },
    {
      imageUrl: 'new-jobs.svg',
      title: 'New Jobs',
      url: 'https://jobs.bdjobs.com/OtherJobs.asp?JobType=new&log=stats',
      bnUrl: 'https://jobs.bdjobs.com/bn/otherjobsbn.asp?JobType=new&log=stats',
      bnTitle: 'নতুন চাকরি'
    },
    {
      imageUrl: 'dead-tom.svg',
      title: 'Deadline Tommorrow',
      url: 'https://jobs.bdjobs.com/OtherJobs.asp?JobType=deadline',
      bnUrl: 'https://jobs.bdjobs.com/OtherJobs.asp?JobType=deadline',
      bnTitle: 'ডেডলাইন আগামীকাল'

    },
    {
      imageUrl: 'part-jobs.svg',
      title: 'Part Time Jobs',
      url: 'https://jobs.bdjobs.com/JobSearch.asp?fcatId=&icatId=&requestType=parttime',
      bnUrl: 'https://jobs.bdjobs.com/JobSearch.asp?fcatId=&icatId=&requestType=parttime',
      bnTitle: 'পার্টটাইম চাকরি '
    },
    {
      imageUrl: 'contract-job.svg',
      title: 'Contractual Jobs',
      url: 'https://jobs.bdjobs.com/OtherJobs.asp?JobType=contract',
      bnUrl: 'https://jobs.bdjobs.com/bn/otherjobsbn.asp?JobType=contract',
      bnTitle: 'চুক্তিভিত্তিক চাকরি'
    },
    {
      imageUrl: 'govt-jobs.svg',
      title: 'Government Jobs',
      url: 'https://jobs.bdjobs.com/OtherJobs.asp?JobType=government',
      bnUrl: 'https://jobs.bdjobs.com/bn/jobsearchbn.asp',
      bnTitle: 'সরকারি চাকরি'
    },
    {
      imageUrl: 'intern-job.svg',
      title: 'Intern Jobs',
      url: 'https://jobs.bdjobs.com/JobSearch.asp?JobType=intern',
      bnUrl: 'https://jobs.bdjobs.com/bn/jobsearchbn.asp?JobType=intern',
      bnTitle: 'ইন্টার্নশিপের সুযোগ'
    },


  ]



  eng: boolean = true;
  ban: boolean = false;

  divNotify: boolean = false;
  userName: string = 'Nafiul Islam Jim';
  userImg: string = '';
  package: string = '';
  proBadge: string = 'images/pro-badge.svg';
  isBanglaLang = new FormControl(false);
  controlIsBanglaLang = computed(
    () => this.isBanglaLang as FormControl<boolean>
  )

  jobSearchUrl: string = '';
  mybdjobsUrl: string = '';
  homeUrl: string = '';
  newJobsUrl: string = '';
  jobsDeadlineTomorrowUrl: string = '';
  jobsPartTimeUrl: string = '';
  jobsContractUrl: string = '';
  jobsGovUrl: string = '';
  jobsLocationWiseUrl: string = '';
  companyListUrl: string = '';
  faqUrl: string = '';

  @Output() languageChange = new EventEmitter<string>();
  @Output() hamburgerToggleEmitter = new EventEmitter<boolean>();




  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['isSidebarOpen']) {
  //     console.log('here', this.isSidebarOpen());
  //   }
  // }

  ngOnInit(): void {
    this.checkScreenSize();

  }

  setUrlBasedOnLanguage(language: string) {
    // console.log(language);
    if (language === 'bn') {
      this.isBanglaLang.setValue(true)
      this.jobSearchUrl = 'https://jobs.bdjobs.com/bn/jobsearchbn.asp';
      this.mybdjobsUrl = "https://mybdjobs.bdjobs.com/bn/mybdjobs/welcomebn.asp"
      this.homeUrl = "https://www.bdjobs.com/bn/defaultbn.asp"
      this.newJobsUrl = "https://jobs.bdjobs.com/bn/otherjobsbn.asp?JobType=new"
      this.jobsDeadlineTomorrowUrl = "https://jobs.bdjobs.com/bn/otherjobsbn.asp?JobType=deadline"
      this.jobsPartTimeUrl = "https://jobs.bdjobs.com/bn/otherjobsbn.asp?JobType=parttime"
      this.jobsContractUrl = "https://jobs.bdjobs.com/bn/otherjobsbn.asp?JobType=contract"
      this.jobsGovUrl = "https://jobs.bdjobs.com/bn/otherjobsbn.asp?JobType=government"
      this.jobsLocationWiseUrl = "https://jobs.bdjobs.com/bn/otherjobsbn.asp?JobType=government"
      this.companyListUrl = "https://jobs.bdjobs.com/bn/company_listbn.asp"
      this.faqUrl = "https://mybdjobs.bdjobs.com/bn/mybdjobs/faqbn.asp"

    }
    else {
      this.isBanglaLang.setValue(false)
      this.jobSearchUrl = 'https://jobs.bdjobs.com/jobsearch.asp';
      this.mybdjobsUrl = "https://mybdjobs.bdjobs.com/mybdjobs/welcome.asp"
      this.homeUrl = "https://bdjobs.com/default.asp"
      this.newJobsUrl = "https://jobs.bdjobs.com/OtherJobs.asp?JobType=new"
      this.jobsDeadlineTomorrowUrl = "https://jobs.bdjobs.com/OtherJobs.asp?JobType=deadline"
      this.jobsPartTimeUrl = "https://jobs.bdjobs.com/OtherJobs.asp?JobType=parttime"
      this.jobsContractUrl = "https://jobs.bdjobs.com/OtherJobs.asp?JobType=contract"
      this.jobsGovUrl = "https://jobs.bdjobs.com/OtherJobs.asp?JobType=government"
      this.jobsLocationWiseUrl = "https://jobs.bdjobs.com/locationwisejobs.asp"
      this.companyListUrl = "https://jobs.bdjobs.com/Company_list.asp"
      this.faqUrl = "https://mybdjobs.bdjobs.com/mybdjobs/faq.asp"
    }
  }

  ShowNotify() {
    this.divNotify = !this.divNotify;
  }

  changeLanguage() {
    console.log("button Clicked")
    console.log(this.isBanglaLang.value)
    this.isBanglaLang.setValue(!this.isBanglaLang.value)
    this.languageChange.emit(
      this.controlIsBanglaLang().value
        ? 'bn'
        : 'en'
    );
    this.setUrlBasedOnLanguage(this.translocoService.getActiveLang());
  }

  isSmallScreen = false; // To check if the screen is small


  // Listen for window resize events
  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }
  @ViewChild('dropdown', { static: false }) dropdown!: ElementRef;
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.dropdown && !this.dropdown.nativeElement.contains(event.target)) {
      this.isJobItemShow.set(false);
    }
  }

  onClickBdjobsPro() {
    // nav pro link
  }

  // Function to determine if the screen is small
  private checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 1024; // Adjust breakpoint if necessary
  }

  // Toggle menu for small screens


  isQuickLinksOpen: boolean = false;
  QuickLinksToggle() {
    this.isQuickLinksOpen = !this.isQuickLinksOpen;
  }

  onClickNotification() { }

  onClickUnreadMessage() { }
}

import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, HostListener, Inject, input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { provideTranslocoScope, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { InputComponent } from "../../../shared/components/input/input.component";
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  providers:[provideTranslocoScope('nav')],
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnChanges{

  isSidebarOpen = input(false);
  profileImagePath = input('');

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

  jobSearchUrl  :string = '';
  mybdjobsUrl  :string = '';
  homeUrl  :string = '';
  newJobsUrl  :string = '';
  jobsDeadlineTomorrowUrl : string = '';
  jobsPartTimeUrl  :string = '';
  jobsContractUrl : string = '';
  jobsGovUrl  :string = '';
  jobsLocationWiseUrl  :string = '';
  companyListUrl : string = '';
  faqUrl  :string = '';

  @Output() languageChange = new EventEmitter<string>();
  @Output() hamburgerToggleEmitter = new EventEmitter<boolean>();


  constructor(private translocoService: TranslocoService ) {
    this.setUrlBasedOnLanguage(translocoService.getActiveLang());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isSidebarOpen']) {
      // console.log('here', this.isSidebarOpen());
    }
  }

  ngOnInit():void {
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
      this.jobsLocationWiseUrl ="https://jobs.bdjobs.com/bn/otherjobsbn.asp?JobType=government"
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
    this.isBanglaLang.setValue(!this.isBanglaLang.value)
    this.languageChange.emit(
      this.controlIsBanglaLang().value
       ? 'bn'
       : 'en'
    );
    this.setUrlBasedOnLanguage(this.translocoService.getActiveLang());
  }

  isSmallScreen = false; // To check if the screen is small
  isMenuOpen = false; // To track menu toggle state

  // Listen for window resize events
  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  onClickBdjobsPro() {
    // nav pro link
  }

  // Function to determine if the screen is small
  private checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 1024; // Adjust breakpoint if necessary
  }

  // Toggle menu for small screens
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isQuickLinksOpen:boolean = false;
  QuickLinksToggle(){
    this.isQuickLinksOpen = !this.isQuickLinksOpen;
  }

  onClickNotification() {}

  onClickUnreadMessage() {}

}

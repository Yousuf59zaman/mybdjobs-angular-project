import { Component, inject, OnInit, signal } from '@angular/core';
import { AtivityFlowModalComponent } from '../ativity-flow-modal/ativity-flow-modal.component';
import { EmployerInterestService } from '../service/employerInterest.service';
import { employerInterestResponse, CompanyActivity } from '../model/employerInterest.model';
import { ActivityFlowResponse, JobActivity } from '../model/activityFlow.model';
import { provideTranslocoScope, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { finalize } from 'rxjs';
import { ModalService } from '../../../../core/services/modal/modal.service';
import { FreeUserDialogueBoxComponent } from '../../../common/free-user-dialogue-box/free-user-dialogue-box.component';
import { NoMatchedHistoryComponent } from '../../../common/no-matched-history/no-matched-history.component';
import { CustomValidationAlertComponent } from '../../../common/custom-validation-alert/custom-validation-alert.component';
import { PaginationTableComponent } from '../../../common/pagination-table/pagination-table.component';
import { convertToBanglaDigits,formatDate } from '../../../common/utility';
import { CookieService } from '../../../../core/services/cookie/cookie.service';



@Component({
  selector: 'app-employer-interest',
  imports: [FreeUserDialogueBoxComponent, NoMatchedHistoryComponent, TranslocoDirective, PaginationTableComponent],
  providers:[provideTranslocoScope('employerInterest')],
  templateUrl: './employer-interest.component.html',
  styleUrl: './employer-interest.component.scss'
})
export class EmployerInterestComponent implements OnInit {
  private modalService = inject(ModalService);
  private empInterestService = inject(EmployerInterestService)
  private translocoService  = inject(TranslocoService)
  convertToBanglaDigits  = convertToBanglaDigits;
  formatDate = formatDate;
  cookieService = inject(CookieService);


  employerInterestResponse : employerInterestResponse=<employerInterestResponse>{};
  companyActivity : CompanyActivity[]=[];
  activityFlowResponse : ActivityFlowResponse = <ActivityFlowResponse>{};
  jobActivity  :JobActivity[]=[];
  totalCmp : number = 0;
  proUser  :boolean = false;
  totalCvView : string ='';
  isErrorExist : number = 1;
  currentLanguage  :string = '';
  currentPage: number = 1;
  pageSize: number = 20;
  isLoading = signal(true);
  //userGuid: string = this.cookieService.getCookie("MybdjobsGId") || '';

  rawCookie = this.cookieService.getCookie("MybdjobsGId") ?? '';
  userGuid = decodeURIComponent(this.rawCookie);

  constructor() {
    this.translocoService.langChanges$.subscribe((lang) => {
      this.currentLanguage = lang;
    });
  }

  ngOnInit(): void {
    this.loadEmployerInterestList();
  }

 
  ActivitiFlow(cmpId:number){
    if (this.userGuid == '') {
      console.warn('User GUID is missing');
      return; // or show an error
    }
    this.empInterestService.getActivityFlowOfCmp(this.userGuid,cmpId)
    .subscribe({
      next: (response) => {
        this.activityFlowResponse = response;
        if(this.activityFlowResponse.event.eventType==1){
          this.jobActivity = this.activityFlowResponse.event.eventData[0].value.data;
    
         
          this.modalService.setModalConfigs({
            componentRef: AtivityFlowModalComponent,
            attributes: {
              modalWidth: '580px',
            },
            inputs: {     
              jobActivityData: this.jobActivity,
              cmpName: this.activityFlowResponse.event.eventData[0].value.common.companyName,
              totalJob: this.activityFlowResponse.event.eventData[0].value.common.totalJob,
            },
            
          });
        }
        else{
          alert("wrong")
        }  
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });

  }


  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadEmployerInterestList();

  }

  loadEmployerInterestList() {
    if (!this.userGuid) {
      console.warn('User GUID is missing');
      return; // or show an error
    }

    this.empInterestService.getEmpInterestList(this.userGuid, this.pageSize, this.currentPage)
    .pipe(
        finalize(() => this.isLoading.update(() => false))
      )
    .subscribe({
      next: (response) => {
        this.isErrorExist=0;
        this.employerInterestResponse = response;
        if(this.employerInterestResponse.event.eventType==1){
          this.companyActivity = this.employerInterestResponse.event.eventData[0].value.employerInterestList;
          this.totalCmp = this.employerInterestResponse.event.eventData[0].value.employerInterestListCommon.totalInterestedCompany;
          this.totalCvView = this.employerInterestResponse.event.eventData[0].value.employerInterestListCommon.totalCompanyViewedCv.toString();
          this.proUser = this.employerInterestResponse.event.eventData[0].value.isProUser;

        }
        else{
          this.modalService.setModalConfigs({
            componentRef: CustomValidationAlertComponent,
            attributes: {
              modalWidth: '480px',
            },
          });
        }  

      },
      error: (err) => {
        this.isErrorExist = 1;
        console.error('API Error:', err);
        this.modalService.setModalConfigs({
          componentRef: CustomValidationAlertComponent,
          attributes: {
            modalWidth: '480px',
          },
        });
       
      }
    });
  }
  
}

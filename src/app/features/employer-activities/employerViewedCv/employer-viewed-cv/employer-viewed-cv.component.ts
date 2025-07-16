import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideTranslocoScope, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import {EmployerViewedCvService } from '../service/employer-viewed-cv.service';
import {EmployerViewResponse,EmployerViewCvItem} from '../model/employer-viewed-cv.model';
import { finalize, from } from 'rxjs';
import { FreeUserDialogueBoxComponent } from '../../../common/free-user-dialogue-box/free-user-dialogue-box.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { DatepickerComponent } from '../../../../shared/components/datepicker/datepicker.component';
import { formatDate,convertToBanglaDigits } from '../../../common/utility';
import { ModalService } from '../../../../core/services/modal/modal.service';
import { CustomValidationAlertComponent } from '../../../common/custom-validation-alert/custom-validation-alert.component';
import { TooltipComponent } from '../../../../shared/components/tooltip/tooltip.component';
import { PaginationTableComponent } from '../../../common/pagination-table/pagination-table.component';
import { NoMatchedHistoryComponent } from '../../../common/no-matched-history/no-matched-history.component';
import { CookieService } from '../../../../core/services/cookie/cookie.service';


@Component({
  selector: 'app-employer-viewed-cv',
  imports: [FreeUserDialogueBoxComponent, InputComponent, SelectComponent, DatepickerComponent, TranslocoDirective, TooltipComponent, PaginationTableComponent, NoMatchedHistoryComponent,ReactiveFormsModule],
  providers:[provideTranslocoScope('employersViewedCv')],
  templateUrl: './employer-viewed-cv.component.html',
  styleUrl: './employer-viewed-cv.component.scss'
})
export class EmployerViewedCvComponent {
    private fb = inject(FormBuilder);
    private translocoService = inject(TranslocoService)
    private employerViewedCvService = inject(EmployerViewedCvService)
    private modalService = inject(ModalService);
    private cookieService = inject(CookieService);
  
    proUser  : boolean = false;
    convertToBanglaDigits = convertToBanglaDigits;
    formatDate = formatDate;
    currentLanguage  :string = '';
    currentPage: number = 1;
    pageSize: number = 20;
    isErrorExist : number = 1;
    employerViewResponse : EmployerViewResponse=<EmployerViewResponse>{};
    employerViewCvItem : EmployerViewCvItem[] = [];
    totalViewed  :number = 0;
    isLoading  = signal(true);
    fromDate: string = '';
    txtStatus: string = '';
    toDate: string = '';
    compName: string = '';
    minDate = new Date(1990, 0, 1)
    cvType:any[] = [];
    showNoMatchedHistory = false;

    //userGuid = this.cookieService.getCookie("MybdjobsGId")|| '';

    rawCookie = this.cookieService.getCookie("MybdjobsGId") ?? '';
    userGuid = decodeURIComponent(this.rawCookie);

    constructor() {
      this.translocoService.langChanges$.subscribe((lang) => {
        this.currentLanguage = lang;
        this.lnchangeForCvType();
      });
    }

    ngOnInit(): void {
      this.loadEmployerViewedCvList();      
    }
  
    CvViewSearchForm = this.fb.group({
      cvTypeSelect: new FormControl<number | null>(0), 
      fromDate: new FormControl<string | null>(null),
      toDate: new FormControl<string | null>(null),
      compName: new FormControl<string | null>(null),
    });
  
    cvTypeControl = computed(
      () => this.CvViewSearchForm.get('cvTypeSelect') as FormControl
    );

    fromDateControl = computed(
      () => this.CvViewSearchForm.get('fromDate') as FormControl
    );

    toDateControl = computed(
      () => this.CvViewSearchForm.get('toDate') as FormControl
    );

    compNameControl = computed(
      () => this.CvViewSearchForm.get('compName') as FormControl
    );

    lnchangeForCvType(){
      if (this.currentLanguage === 'en') {
        this.cvType = [
          { value: 0, label: 'All' },
          { value: 1, label: 'Bdjobs Profile' },
          { value: 2, label: 'Personalized CV' },
          { value: 3, label: 'Video CV' },
          { value: 4, label: 'Summary CV' }
        ]
      }
      else{
        this.cvType = [
          { value: 0, label: 'সব' },
          { value: 1, label: 'বিডিজবস রিজিউমি' },
          { value: 2, label: 'পার্সোনালাইজড রিজিউমি' },
          { value: 3, label: 'ভিডিও রিজিউমি' },
          { value: 4, label: 'রিজিউমির সারাংশ' }
        ]
  
      }

    }

    loadEmployerViewedCvList() {
      if (this.userGuid=='') {
        console.warn('User GUID is missing');
        return; // or show an error
      }
      this.isLoading.set(true); 
      this.employerViewedCvService.getEmpViewedCvList(this.userGuid, this.pageSize, this.currentPage, this.fromDate, this.toDate, this.compName, this.txtStatus)
      .pipe(
          finalize(() => this.isLoading.update(() => false))
        )
      .subscribe({
        next: (response) => {
          this.isErrorExist=0;
          this.employerViewResponse = response;
          if(this.employerViewResponse.event.eventType==1){
            this.showNoMatchedHistory = false;
            this.employerViewCvItem = this.employerViewResponse.event.eventData[0].value.data;
            this.totalViewed = this.employerViewResponse.event.eventData[0].value.common.totalNumberOfItems;
            this.proUser = this.employerViewResponse.event.eventData[0].value.common.isproUser;
  
          }
          else if(this.employerViewResponse.event.eventType==2){
            this.showNoMatchedHistory = true;
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

    onPageChange(newPage: number) {
      this.currentPage = newPage;
      this.loadEmployerViewedCvList();
  
    }

    onSearch(){
      this.fromDate = this.fromDateControl().value ? this.fromDateControl().value : '';
      this.fromDate = this.fromDate? `${new Date(this.fromDate).getMonth() + 1}/${new Date(this.fromDate).getDate()}/${new Date(this.fromDate).getFullYear()}`: '';

      this.toDate = this.toDateControl().value ? this.toDateControl().value: '';
      this.toDate = this.toDate? `${new Date(this.toDate).getMonth() + 1}/${new Date(this.toDate).getDate()}/${new Date(this.toDate).getFullYear()}`: '';

      this.compName = this.compNameControl().value ? this.compNameControl().value : '';
      this.txtStatus = this.cvTypeControl().value ? this.cvTypeControl().value: 0;

      this.loadEmployerViewedCvList();

    }
}

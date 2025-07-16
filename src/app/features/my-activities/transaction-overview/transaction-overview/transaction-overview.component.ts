import { Component, OnInit, computed } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { SelectboxComponent } from "../../../../shared/components/selectbox/selectbox.component";
import { selectBoxItem } from '../../../../shared/models/models';
import { DateRangePickerComponent } from "../../../../shared/components/date-range-picker/date-range-picker.component";
import { TransactionService } from '../service/transaction.service';
import { catchError, of } from 'rxjs';
import { Transaction, TransactionRequest } from '../model/transaction';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from '../../../../core/services/cookie/cookie.service';
import { PaginationTableComponent } from "../../../common/pagination-table/pagination-table.component";


@Component({
 selector: 'app-transaction-overview',
 standalone: true,
 imports: [
    ReactiveFormsModule,
    FormsModule,
    TranslocoModule,
    CommonModule,
    PaginationComponent,
    SelectboxComponent,
    DateRangePickerComponent,
    HttpClientModule,
    PaginationTableComponent
],
 providers: [provideTranslocoScope('transactionOverview')],
 templateUrl: './transaction-overview.component.html',
 styleUrl: './transaction-overview.component.scss'
})
export class TransactionOverviewComponent implements OnInit {
 totalFound = 0;
 totalPages = 1;
 currentPage = 1;
 noOfRecordsPerPage = 10;
 isLoading = false;
 errorMessage = '';


 selectedStartDate: Date | null = null;
 selectedEndDate: Date | null = null;
 dateRangeString = '';
 calendarVisible = false;
 currentLanguage = 'en';
 isInfoAvailable = false;
 UserGuid ='ZiZuPid0ZRLyZ7S3YQ00PRg7MRgwPELyBTYxPRLzZESuYTU0BFPtBFVUIGL3Ung='


 transactions: Transaction[] = [];


 SelecteFeature: selectBoxItem[] = [];


 jobNature: any[] = [];


 private lnChangeForSelectFeature() {
   if (this.currentLanguage === 'en') {
     this.SelecteFeature = [
       { label: 'Select', value: "0" }, // Added "All" option
       { label: 'Bdjobs Pro', value: "4" },
       { label: 'SMS Job Alert', value: "2" },
       { label: 'Online Job Application', value: "3" },
       { label: 'My Personal Hiring', value: "5" },
     ];
   }
   else {
     this.SelecteFeature = [
       { label: 'নির্বাচন করুন', value: "0" }, // Added "All" option
       { label: 'বিডিজবস প্রো', value: "4" },
       { label: 'এসএমএস জব অ্যালার্ট', value: "2" },
       { label: 'অনলাইন জব এপ্লিকেশন', value: "3" },
       { label: 'মাই পার্সোনাল হায়ারিং', value: "5" },
     ];

   }
 }




 transactionForm: FormGroup;


 selectedFeatureControl = computed(
   () => this.transactionForm.get('select') as FormControl<string>
 );


 fromDateControl = computed(
   () => this.transactionForm.get('fromDate') as FormControl
 );


 toDateControl = computed(
   () => this.transactionForm.get('toDate') as FormControl
 );


 constructor(
   private fb: FormBuilder,
   private transactionService: TransactionService,
   private translocoService: TranslocoService,
   private cookieService: CookieService
 ) {
   this.transactionForm = this.fb.group({
     select: ['0', Validators.required], // Default to "All" (0)
     duration: [''],
     fromDate: [null],
     toDate: [null],
     serviceName: new FormControl,
     date: new FormControl,
     amount: new FormControl,
     paymentMethod: new FormControl
   });
   this.translocoService.langChanges$.subscribe((lang) => {
       this.currentLanguage = lang;
       this.lnChangeForSelectFeature();
     });
 }


 ngOnInit(): void {
   this.loadTransaction();
 }


 loadTransaction(): void {
   this.isLoading = true;
   this.errorMessage = '';
   this.transactions = [];


   if (this.currentPage === 1 || this.currentPage > this.totalPages) {
     this.currentPage = 1;
   }


   const request: TransactionRequest = {
     fromDate: this.selectedStartDate ? this.formatDateForAPI(this.selectedStartDate) : '',
     toDate: this.selectedEndDate ? this.formatDateForAPI(this.selectedEndDate) : '',
     featureStatus: parseInt(this.transactionForm.get('select')?.value || '0'),
     UserGuid: this.UserGuid,
     currentPage: this.currentPage,
     noOfRecordsPerPage: this.noOfRecordsPerPage
   };


   console.log('API Request:', request);


   this.transactionService.getTransactionList(request).pipe(
     catchError(error => {
       this.isLoading = false;
       return of([]);
     })
   ).subscribe((data: Transaction[]) => {
     this.isLoading = false;
     console.log('API Response:', data);
     this.transactions = data;


     if (data.length > 0) {
       this.totalFound = data[0].totalFound;
       this.totalPages = Math.ceil(this.totalFound / this.noOfRecordsPerPage);
     } else {
       this.totalFound = 0;
       this.totalPages = 1;
     }
   });
 }


  get serviceNameControl(): FormControl {
   return this.transactionForm.get('serviceName') as FormControl;
 }


 get dateControl(): FormControl {
   return this.transactionForm.get('date') as FormControl;
 }
 get paymentMethodControl(): FormControl {
   return this.transactionForm.get('paymentMethod') as FormControl;
 }


 get amountControl(): FormControl {
   return this.transactionForm.get('amount') as FormControl;
 }


 formatDateForAPI(date: Date): string {
   return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
 }


 onSearch(): void {
   this.currentPage = 1;
   this.loadTransaction();
 }


 onPageChange(page: number): void {
   this.currentPage = page;
   this.loadTransaction();
 }


 toggleCalendar() {
   this.calendarVisible = !this.calendarVisible;
 }


 onStartDateChange(date: Date | null) {
   this.selectedStartDate = date;
   this.transactionForm.get('fromDate')?.setValue(date);
   this.updateDateRangeString();
 }


 onEndDateChange(date: Date | null) {
   this.selectedEndDate = date;
   this.transactionForm.get('toDate')?.setValue(date);
   this.updateDateRangeString();
 }


 updateDateRangeString() {
   if (this.selectedStartDate && this.selectedEndDate) {
     this.dateRangeString = `${this.formatDate(this.selectedStartDate)} – ${this.formatDate(this.selectedEndDate)}`;
     this.transactionForm.patchValue({ duration: this.dateRangeString });
   } else if (this.selectedStartDate) {
     this.dateRangeString = `${this.formatDate(this.selectedStartDate)} – `;
   } else if (this.selectedEndDate) {
     this.dateRangeString = `– ${this.formatDate(this.selectedEndDate)}`;
   } else {
     this.dateRangeString = '';
     this.transactionForm.patchValue({ duration: '' });
   }
 }


 formatDate(date: Date): string {
  if (this.currentLanguage === 'bn') {
    const bengaliMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const month = bengaliMonths[date.getMonth()];
    const day = this.toBengaliNumber(date.getDate());
    const year = this.toBengaliNumber(date.getFullYear());
    return `${day} ${month}, ${year}`;
  }
   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
   const month = months[date.getMonth()];
   const day = date.getDate();
   const year = date.getFullYear();
   return `${day} ${month}, ${year}`;
  }

 formatNumber(num: number | string): string {
    if (this.currentLanguage === 'bn') {
      return this.toBengaliNumber(Number(num));
    }
    return num.toString();
  }

 public toDate(dateStr: string): Date {
  return new Date(dateStr);
}
  toBengaliNumber(n: number): string {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n.toString().split('').map(digit => bengaliDigits[parseInt(digit, 10)]).join('');
  }


 clearFilters(): void {
   this.transactionForm.patchValue({
     select: '0',
     fromDate: null,
     toDate: null
   });
   this.selectedStartDate = null;
   this.selectedEndDate = null;
   this.dateRangeString = '';
   this.currentPage = 1;
   this.loadTransaction();
 }
}



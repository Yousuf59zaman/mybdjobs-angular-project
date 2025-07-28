import { Component, computed, inject } from '@angular/core';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ResumeEmailService } from '../../service/resume-email.service';
import { DeleteResume, GetEmailedResumeQuery, GetEmailedResumeResponse } from '../../interface/resume-email';
import { DatepickerComponent } from '../../../../../shared/components/datepicker/datepicker.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { SelectComponent } from '../../../../../shared/components/select/select.component';
import { CheckboxComponent } from '../../../../../shared/components/checkbox/checkbox.component';
import { PaginationTableComponent } from '../../../../common/pagination-table/pagination-table.component';
import { NoMatchedHistoryComponent } from '../../../../common/no-matched-history/no-matched-history.component';
import { CookieService } from '../../../../../core/services/cookie/cookie.service';



@Component({
    selector: 'app-resume-email',
    imports: [DatepickerComponent, TranslocoModule, InputComponent, SelectComponent, DatePipe, CheckboxComponent, ReactiveFormsModule, PaginationTableComponent, NoMatchedHistoryComponent],
    providers: [provideTranslocoScope('resumeEmail')],
    templateUrl: './resume-email.component.html',
    styleUrl: './resume-email.component.scss'
})
export class ResumeEmailComponent {
    searchForm: FormGroup;
    searchMinDate = new Date(1990, 0, 1)
    currentLanguage = 'en';
    currentPage: number = 1;
    pageSize: number = 20;
    results: GetEmailedResumeResponse[] = [];
    currentDate = new Date();
    count: number = 0;
    totalItems: number = 0;
    cookieService = inject(CookieService);
    
    //userGuid = this.cookieService.getCookie("MybdjobsGId")? this.cookieService.getCookie("MybdjobsGId") : '';

    rawCookie = this.cookieService.getCookie("MybdjobsGId") ?? '';
    userGuid = decodeURIComponent(this.rawCookie);
    
    cvTypes = [
        { value: null, label: 'Select' },
        { value: 1, label: 'PersonalizedCV' },
        { value: 0, label: 'MyBdjobsFormat' }
    ];
    deleteControl = new FormControl(false);
    selectedItems: { [key: string]: boolean } = {};

    constructor(
        private fb: FormBuilder,
        private resumeEmailService: ResumeEmailService,
        private translocoService: TranslocoService
    ) {
        this.searchForm = this.fb.group({
            FromDate: [''],
            SearchToDate: [''],
            SearchSubjectName: [''],
            cvType: [null]
        });
    }
    FromDate = computed(
        () => this.searchForm.get('FromDate') as FormControl
    );

    SearchToDate = computed(
        () => this.searchForm.get('SearchToDate') as FormControl
    );
    SearchSubjectName = computed(
        () => this.searchForm.get('SearchSubjectName') as FormControl
    );

    cvType = computed(
        () => this.searchForm.get('cvType') as FormControl
    );


    ngOnInit(): void {
        this.loadInitialData();
        this.deleteControl.valueChanges.subscribe((check) => {/* Removed for production */})
    }

    loadInitialData(): void {
        const query: GetEmailedResumeQuery = {
            PageNo: this.currentPage,
            UserGuid: this.userGuid || "",
            PageSize: this.pageSize,
            LanType: this.translocoService.getActiveLang(),
            cvType: null,
            FromDate: '',
            SearchToDate: '',
            SearchSubjectName: ''
        };
        this.search(query);
    }

    onPageChange(newPage: number) {
        this.currentPage = newPage;
        const query: GetEmailedResumeQuery = {
            PageNo: this.currentPage,
            UserGuid: 'ZiZuPid0ZRLyZ7S3YQ00PRg7MRgwPELyBTYxPRLzZESuYTU0BFPtBFVUIGL3Ung=',
            PageSize: this.pageSize,
            LanType: this.translocoService.getActiveLang(),
            cvType: this.cvType().value,
            FromDate: this.FromDate().value ? new Date(this.FromDate().value).toISOString().split('T')[0] : '',
            SearchToDate: this.SearchToDate().value ? new Date(this.SearchToDate().value).toISOString().split('T')[0] : '',
            SearchSubjectName: this.SearchSubjectName().value || ''
        };
        this.search(query);
    }

    validateSearchFromDate() {
        let errorFromDateMsg = '';
        const fromDateValue = this.FromDate().value;

        if (fromDateValue) {
            if (!/^\d+$/.test(fromDateValue)) {
                if (this.currentLanguage === 'en') {
                    errorFromDateMsg = "From Date must be numeric only.";
                } else {
                    errorFromDateMsg = "শুরুর তারিখ শুধুমাত্র সংখ্যা হতে হবে।";
                }
            } else if (fromDateValue == '' || fromDateValue == null) {
                if (this.currentLanguage === 'en') {
                    errorFromDateMsg = "Please enter From Date.";
                } else {
                    errorFromDateMsg = "শুরুর তারিখ লিখুন।";
                }
            } else if (fromDateValue > this.currentDate) {
                if (this.currentLanguage === 'en') {
                    errorFromDateMsg = "From Date can not be greater than current date!";
                } else {
                    errorFromDateMsg = "তারিখ বর্তমান তারিখের চেয়ে বড় হবে না!";
                }
            }
        }

        return errorFromDateMsg;
    }

    validateSearchToDate() {
        let errorToDateMsg = '';
        const toDateValue = this.SearchToDate().value;

        if (toDateValue) {
            if (!/^\d+$/.test(toDateValue)) {
                if (this.currentLanguage === 'en') {
                    errorToDateMsg = "To Date must be numeric only.";
                } else {
                    errorToDateMsg = "শেষ তারিখ শুধুমাত্র সংখ্যা হতে হবে।";
                }
            } else if (toDateValue == '' || toDateValue == null) {
                if (this.currentLanguage === 'en') {
                    errorToDateMsg = "Please enter To Date.";
                } else {
                    errorToDateMsg = "চাকরীর শেষ তারিখ লিখুন।";
                }
            } else if (toDateValue > this.currentDate) {
                if (this.currentLanguage === 'en') {
                    errorToDateMsg = "To Date can not be greater than current date!";
                } else {
                    errorToDateMsg = "তারিখ বর্তমান তারিখের চেয়ে বড় হবে না!";
                }
            }
        }

        return errorToDateMsg;
    }


    onSearch(): void {
        const formValue = this.searchForm.value;
        
        const fromDate = formValue.FromDate ? new Date(formValue.FromDate).toISOString().split('T')[0] : '';
        const toDate = formValue.SearchToDate ? new Date(formValue.SearchToDate).toISOString().split('T')[0] : '';
        
        const query: GetEmailedResumeQuery = {
            PageNo: 1,
            UserGuid: 'ZiZuPid0ZRLyZ7S3YQ00PRg7MRgwPELyBTYxPRLzZESuYTU0BFPtBFVUIGL3Ung=',
            PageSize: 20,
            LanType: this.translocoService.getActiveLang(),
            cvType: formValue.cvType,
            FromDate: fromDate,
            SearchToDate: toDate,
            SearchSubjectName: formValue.SearchSubjectName || ''
        };
        this.search(query);
    }

    search(query: GetEmailedResumeQuery): void {
        this.resumeEmailService.getEmailedResumes(query).subscribe({
            next: (res) => {
                this.results = res || [];
                this.count = this.results.reduce((total, item) => {
                    return (item.totalJob || 0);
                }, 0);
                this.totalItems = this.count;
            },
            error: (err) => {
                console.error('Error fetching resumes', err);
                this.results = [];
                this.count = 0;
                this.totalItems = 0;
            }
        });
    }

    
    showDeleteConfirm = false;
    showNoSelectionPopup = false;
    pendingDeleteIds: string[] = [];
    showDeleteModal() {
        const selectedIds = this.getSelectedIds();
        if (selectedIds.length > 0) {
            this.pendingDeleteIds = selectedIds;
            this.showDeleteConfirm = true;
        } else {
            this.showNoSelectionPopup = true;
        }
    }

    closeNoSelectionPopup() {
        this.showNoSelectionPopup = false;
    }

    cancelDelete() {
        this.showDeleteConfirm = false;
        this.pendingDeleteIds = [];
        this.deleteControl.setValue(false);
        Object.keys(this.selectedItems).forEach(key => {
            this.selectedItems[key] = false;
        });
    }

    confirmDelete() {
        if (this.pendingDeleteIds.length > 0) {
            const deletePromises = this.pendingDeleteIds.map(id => {
                const deleteData: DeleteResume = {
                    id: id,
                    UserGuid: 'ZiZuPid0ZRLyZ7S3YQ00PRg7MRgwPELyBTYxPRLzZESuYTU0BFPtBFVUIGL3Ung='
                };
                
                return this.resumeEmailService.deleteResume(deleteData).toPromise();
            });

            Promise.all(deletePromises)
                .then(() => {
                    this.searchForm.reset();
                    this.loadInitialData();
                })
                .catch(err => {
                    console.error('Error deleting items:', err);
                });
        }
        this.cancelDelete();
    }

    onCheckboxChange(id: string, event: Event): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        this.selectedItems[id] = isChecked;
    }

    getSelectedIds(): string[] {
        return Object.entries(this.selectedItems)
            .filter(([_, isSelected]) => isSelected)
            .map(([id]) => id);
    }

    deleteSelectedItems(): void {
        const selectedIds = this.getSelectedIds();
        if (selectedIds.length > 0) {
            this.pendingDeleteIds = selectedIds;
            this.showDeleteConfirm = true;
        }
    }
}

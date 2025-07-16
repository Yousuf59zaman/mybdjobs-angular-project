import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import {
  DeleteShortlistedJobsRequest,
  ShortlistedJob,
  ShortlistedJobsRequest,
} from '../models/shortlisted_job';
import { ShortlistedJobService } from '../services/shortlisted-job.service';
import { DatepickerComponent } from '../../../../shared/components/datepicker/datepicker.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { CheckboxComponent } from '../../../../shared/components/checkbox/checkbox.component';
import { CookieService } from '../../../../core/services/cookie/cookie.service';


@Component({
  selector: 'app-shortlisted-job',
  imports: [
    DatepickerComponent,
    InputComponent,
    CheckboxComponent,
    ReactiveFormsModule,
    TranslocoModule
  ],
  providers: [provideTranslocoScope('shortlistedJob'), DatePipe],
  templateUrl: './shortlisted-job.component.html',
  styleUrl: './shortlisted-job.component.scss',
})
export class ShortlistedJobComponent {
  searchForm: FormGroup;
  fromDateFormatted: string | null = null;
  toDateFormatted: string | null = null;
  toDate: string = '';
  companyName: string = '';
  searchMinDate = new Date(1990, 0, 1);
  deleteControl = new FormControl(false);
  selectedJobIds: number[] = [];
  shortlistedJobs: ShortlistedJob[] = [];
  IdofDelete =0;
  count = 0;
  Fromval: string = '';
  isDeleting = false;
  cookieService = inject(CookieService);
  //userGuid = this.cookieService.getCookie("MybdjobsGId")? this.cookieService.getCookie("MybdjobsGId") : '';

  rawCookie = this.cookieService.getCookie("MybdjobsGId") ?? '';
  userGuid = decodeURIComponent(this.rawCookie);

  constructor(
    private fb: FormBuilder,
    private svc: ShortlistedJobService,
    private datePipe: DatePipe
  ) {
    this.searchForm = this.fb.group({
      FromDate: [null],
      SearchToDate: [null],
      SearchData: [''],
    });
    this.loadJobs();
  }
  FromDate = computed(() => this.searchForm.get('FromDate') as FormControl);

  SearchToDate = computed(
    () => this.searchForm.get('SearchToDate') as FormControl
  );
  SearchData = computed(() => this.searchForm.get('SearchData') as FormControl);
  ngOnInit() {
    this.FromDate().valueChanges.subscribe((raw) => {   
      if (raw) {
        const d = new Date(raw);
        d.setHours(0, 0, 0, 0);
        this.fromDateFormatted = this.datePipe.transform(
          d,
          'yyyy-MM-dd HH:mm:ss'
        );
      } else {
        this.fromDateFormatted = null;
      }
    });

    this.SearchToDate().valueChanges.subscribe((raw) => {
      if (raw) {
        const d = new Date(raw);
        d.setHours(0, 0, 0, 0);
        this.toDateFormatted = this.datePipe.transform(
          d,
          'yyyy-MM-dd HH:mm:ss'
        );
      } else {
        this.toDateFormatted = null;
      }
    });
    this.loadJobs();
  }
  loadJobs() {
    const formValues = this.searchForm.getRawValue();
    const req: ShortlistedJobsRequest = {
      CurrentPage: 1,
      GuidId: this.userGuid || "",
      PerPageData: 10,
      LanType: 'EN',
      SearchData: this.SearchData().value, 
      FromDate: this.fromDateFormatted, 
      ToDate: this.toDateFormatted,
    };
    this.svc.getShortlistedJobs(req).subscribe((jobs) => {
      this.shortlistedJobs = jobs.map(job => ({
        ...job,
        deadline: this.datePipe.transform(job.deadline, 'MMM d, y') || ''
      }));
      this.count = jobs.length;
          
    });
  }

  onSearch() {
    this.loadJobs();
  }
  showDeleteConfirm = false;
  showNoSelectionPopup = false;
  pendingDeleteId: string | null = null;

  showDeleteModal() {
    const selectedIds = 1;
    if (selectedIds > 0) {
      this.showDeleteConfirm = true;
    } else {
      this.showNoSelectionPopup = true;
    }
  }

  onCheckboxChange(id: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedJobIds.push(id);
      console.log(this.selectedJobIds);
           
    } else {
      this.selectedJobIds = this.selectedJobIds.filter(id => id !== id);
    }
  }


  onDateSelected(date: Date | null) {
    if (!date) return;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const f = this.datePipe.transform(d, 'yyyy-MM-dd HH:mm:ss');
    if (f) {
      this.fromDateFormatted = f;
      this.FromDate().setValue(f); 
    }
  }

  toDateSelected(date: Date | null) {
    if (!date) return;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const f = this.datePipe.transform(d, 'yyyy-MM-dd HH:mm:ss');
    if (f) {
      this.toDateFormatted = f;
      this.SearchToDate().setValue(f);
    }
  }
  cancelDelete() {
    this.showDeleteConfirm = false;
    this.pendingDeleteId = null;
    this.deleteControl.setValue(false);
  }
  confirmDelete() {
    this.showDeleteConfirm = false;
    const req: DeleteShortlistedJobsRequest = {
      GuidId: this.userGuid || "",          
      
      JP_ID : this.selectedJobIds.toString()
    };

    this.svc.deleteShortlistedJobs(req).subscribe(() => {
      this.loadJobs();        
      this.cancelDelete();    
      this.selectedJobIds = [];
    }, error => {
      console.error('Delete failed', error);
    });
    complete: () => {
      this.selectedJobIds = []; 
    }
  }
}

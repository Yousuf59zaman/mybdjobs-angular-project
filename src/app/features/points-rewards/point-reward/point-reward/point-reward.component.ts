import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { PointsService } from '../../service/point-reward.service';
import { PointsSearchQuery, PointsApiResponse, GetPointsListResponse, PointEvent } from '../../interface/pointReward';
import { PaginationTableComponent } from "../../../common/pagination-table/pagination-table.component";
import { ProgressBarComponent } from "../../progress-bar/progress-bar/progress-bar.component";
import { DatepickerComponent } from "../../../../shared/components/datepicker/datepicker.component";
import { SelectComponent } from "../../../../shared/components/select/select.component";
import { NoMatchedHistoryComponent } from "../../../common/no-matched-history/no-matched-history.component";
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CookieService } from '../../../../core/services/cookie/cookie.service';


@Component({
  selector: 'app-points-rewards',
  templateUrl: './point-reward.component.html',
  styleUrls: ['./point-reward.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginationTableComponent, 
    ProgressBarComponent, 
    DatepickerComponent, 
    SelectComponent, 
    NoMatchedHistoryComponent
  ],
})
export class PointsRewardsComponent implements OnInit {
  pointsForm: FormGroup;
  results: GetPointsListResponse[] = [];
  totalItems = 0;
  totalPoint = '0';
  pageSize = 20;
  currentPage = 1;
  minDate = new Date(1990, 0, 1);
  isLoading = false;
  errorMessage = '';

  cookieService = inject(CookieService);
  //userGuid = this.cookieService.getCookie("MybdjobsGId")? this.cookieService.getCookie("MybdjobsGId") : '';
  
  rawCookie = this.cookieService.getCookie("MybdjobsGId") ?? '';
  userGuid = decodeURIComponent(this.rawCookie);
  
  pointType = [
    { value: 0, label: 'All' },
    { value: 1, label: 'Earned points' },
    { value: 2, label: 'Redeemed points' },
    { value: 3, label: 'Deducted points' },
  ];

  constructor(
    private fb: FormBuilder,
    private pointService: PointsService
  ) {
    this.pointsForm = this.fb.group({
      fromDate: [null],
      toDate: [null],
      pointType: ['']
    });
  }

  ngOnInit(): void {
    this.loadPoints();
  }

  fromDateControl() {
    return this.pointsForm.get('fromDate') as FormControl;
  }

  toDateControl() {
    return this.pointsForm.get('toDate') as FormControl;
  }

  filterControl() {
    return this.pointsForm.get('pointType') as FormControl;
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadPoints();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPoints();
  }

  loadPoints(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const form = this.pointsForm.value;
    const query: PointsSearchQuery = {
      FromDate: form.fromDate ? this.formatDate(form.fromDate) : undefined,
      ToDate: form.toDate ? this.formatDate(form.toDate) : undefined,
      UserGuid: this.userGuid || "",
      PointType: form.pointType || undefined,
      PageNo: this.currentPage,
      PageSize: this.pageSize
    };

    this.pointService.getPointsList(query).pipe(
      catchError(error => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load points data. Please try again later.';
        console.error('API Error:', error);
        return of(null);
      })
    ).subscribe((response: PointsApiResponse | null) => {
      this.isLoading = false;
      
      if (!response) {
        this.results = [];
        this.totalItems = 0;
        this.totalPoint = '0';
        return;
      }

      const pointsData = response.event.eventData.find(data => data.key === 'message')?.value || [];
      
      // Get total count from the first item's total field
      const totalCount = pointsData[0]?.total ? parseInt(pointsData[0].total) : 0;
      this.totalItems = totalCount;
      
      this.results = pointsData.map(item => ({
        Date: item.day,
        Activity: item.activity,
        PointHistory: item.pointEarned,
        Total: item.total,
        TotalPoint: item.totaL_POINT
      }));
      
      this.totalPoint = pointsData[0]?.totaL_POINT || '0';
    });
  }

  /** yyyy-MM-dd */
  private formatDate(d: Date): string {
    const yy = d.getFullYear();
    const mm = ('0' + (d.getMonth() + 1)).slice(-2);
    const dd = ('0' + d.getDate()).slice(-2);
    return `${yy}-${mm}-${dd}`;
  }
}
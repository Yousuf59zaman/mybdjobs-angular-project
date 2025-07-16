import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { convertToBanglaDigits } from '../utility';

@Component({
  selector: 'app-pagination-table',
  imports: [NgFor,NgIf],
  templateUrl: './pagination-table.component.html',
  styleUrl: './pagination-table.component.scss'
})
export class PaginationTableComponent implements OnInit {

    @Input() totalItems = 0;
    @Input() itemsPerPage = 0;
    @Input() currentPage = 1;
    @Input() strVersion: 'EN' | 'BN' = 'EN';
    @Output() pageChanged = new EventEmitter<number>();
    private translocoService  = inject(TranslocoService)
  
    pages: number[] = [];
    totalPages = 0;
    displayPages: number[] = [];
    currentLanguage: string = '';
    convertToBanglaDigits = convertToBanglaDigits;

    constructor() {
      this.translocoService.langChanges$.subscribe((lang) => {
        this.currentLanguage = lang;
      });
    }
  
    ngOnInit(): void {
      this.calculatePagination();
    }
  
    ngOnChanges(): void {
      this.calculatePagination();
    }
  
    calculatePagination() {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      let start = this.currentPage <= 4 ? 2 : this.currentPage - 3;
      let end = start + 4;
      if (this.totalPages - this.currentPage < 4) start = Math.max(this.totalPages - 5, 2);
      this.displayPages = [];
  
      for (let i = start; i <= end && i < this.totalPages; i++) {
        this.displayPages.push(i);
      }
    }
  
    goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.pageChanged.emit(page);
      }
    }

    formatNumber(num: number): string {
      return this.convertToBanglaDigits(num.toString(),this.currentLanguage);
    }
}






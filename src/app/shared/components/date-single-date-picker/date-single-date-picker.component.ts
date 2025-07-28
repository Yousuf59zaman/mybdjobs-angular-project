import { CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, EventEmitter, input, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-single-date-picker',
  imports: [NgClass,ReactiveFormsModule],
  templateUrl: './date-single-date-picker.component.html',
  styleUrl: './date-single-date-picker.component.scss'
})
export class DateSingleDatePickerComponent<T> implements OnInit {

   @Input() selectedStartDate: Date | null = null;
    @Input() selectedEndDate: Date | null = null;
    @Input() allowSingleDateSelection: boolean = true;
    @Output() selectedStartDateChange = new EventEmitter<Date | null>();
    @Output() selectedEndDateChange = new EventEmitter<Date | null>();
    readonly isRequired = input<boolean>(false)
    readonly placeholder = input<string>('Select a date')
    readonly label = input<string>('Date')
    readonly control = input<FormControl<T>>(new FormControl());
    currentDate = new Date();
    startCurrentMonth: number = this.currentDate.getMonth() - 1 < 0 ? 11 : this.currentDate.getMonth() - 1;
    startCurrentYear: number = this.startCurrentMonth === 11 ? this.currentDate.getFullYear() - 1 : this.currentDate.getFullYear();
    endCurrentMonth: number = this.currentDate.getMonth();
    endCurrentYear: number = this.currentDate.getFullYear();
    months!: string[];
    yearMonthSelectorVisible: { start: boolean; end: boolean } = { start: false, end: false };
    dateRangeString: string = '';
    daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    selectedLang: 'en' | 'bn' = 'en'; 
    // Add these properties to your component
  showStartMonthDropdown = false;
  showStartYearDropdown = false;
  showEndMonthDropdown = false;
  showEndYearDropdown = false;
  currentYear = new Date().getFullYear();
  

  
  // Methods to toggle dropdowns
  toggleMonthDropdown(type: 'start' | 'end') {
    if (type === 'start') {
      this.showStartMonthDropdown = !this.showStartMonthDropdown;
      this.showStartYearDropdown = false;
    } else {
      this.showEndMonthDropdown = !this.showEndMonthDropdown;
      this.showEndYearDropdown = false;
    }
  }
  
  
  
  
  private generateStartCalendarDays() {
    this.generateDaysInMonth(this.startCurrentYear, this.startCurrentMonth, 'start');
  }
  
  private generateEndCalendarDays() {
    this.generateDaysInMonth(this.endCurrentYear, this.endCurrentMonth, 'end');
  }
  
  
  
  
  // toggleYearDropdown(type: 'start' | 'end') {
  //   if (type === 'start') {
  //     this.showStartYearDropdown = !this.showStartYearDropdown;
  //     this.showStartMonthDropdown = false;
  //     console.log("year",this.showStartYearDropdown)
  //   } else {
  //     this.showEndYearDropdown = !this.showEndYearDropdown;
  //     this.showEndMonthDropdown = false;
  //   }
    
  // }
  toggleYearDropdown(type: 'start' | 'end') {
    if (type === 'start') {
      // Removed for production
      this.showStartYearDropdown = !this.showStartYearDropdown;
      this.showStartMonthDropdown = false;
      // Removed for production
    } else {
      // Removed for production
      this.showEndYearDropdown = !this.showEndYearDropdown;
      this.showEndMonthDropdown = false;
      // Removed for production
    }
  }
  
 
  
  
  // Method to select month
  selectMonth(monthIndex: number, type: 'start' | 'end') {
    if (type === 'start') {
      this.startCurrentMonth = monthIndex;
      this.showStartMonthDropdown = false;
      this.generateStartCalendarDays();
    } else {
      this.endCurrentMonth = monthIndex;
      this.showEndMonthDropdown = false;
      this.generateEndCalendarDays();
    }
  }
  
  // Method to select year
  selectYear(year: number, type: 'start' | 'end') {
    if (type === 'start') {
      this.startCurrentYear = year;
      this.showStartYearDropdown = false;
      this.generateStartCalendarDays();
    } else {
      this.endCurrentYear = year;
      this.showEndYearDropdown = false;
      this.generateEndCalendarDays();
    }
  }
  
  // Method to generate year range (1971 to current year)
  getYearRange(): number[] {
    const years = [];
    const startYear = 1900;
    for (let year = this.currentYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  }
  
  
  
    private getMonths(lang: 'en' | 'bn'): string[] {
      if (lang === 'bn') {
        return [
          'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
          'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
        ];
      } else {
        return [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
      }
    }
  
    private getDaysOfWeek(lang: 'en' | 'bn'): string[] {
      if (lang === 'bn') {
        return ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];
      } else {
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      }
    }
  
     convertToBanglaNumber(value: number): string {
      const bnNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return value.toString().split('').map(digit => bnNumbers[parseInt(digit)]).join('');
    }
    
    
    calendarVisible: boolean = false;
    private globalClickUnlistener: (() => void) | null = null;
  
    constructor(private renderer: Renderer2, private elRef: ElementRef
    ) {
    
      }
  
    startDaysInMonth: (Date | null)[] = [];
    endDaysInMonth: (Date | null)[] = [];
    tempStartDate: Date | null = null;
    tempEndDate: Date | null = null;
    
  
    ngOnInit() {
      this.control().valueChanges.subscribe((value) => {
        // Removed for production
      })
      this.tempStartDate = this.selectedStartDate;
      this.tempEndDate = this.selectedEndDate;
      this.generateDaysInMonth(this.startCurrentYear, this.startCurrentMonth, 'start');
      this.generateDaysInMonth(this.endCurrentYear, this.endCurrentMonth, 'end');
      this.tempStartDate = this.selectedStartDate;
      this.tempEndDate = this.selectedEndDate;
  
      this.months = this.getMonths(this.selectedLang);
      this.daysOfWeek = this.getDaysOfWeek(this.selectedLang);
  
      this.generateDaysInMonth(this.startCurrentYear, this.startCurrentMonth, 'start');
      this.generateDaysInMonth(this.endCurrentYear, this.endCurrentMonth, 'end');
    }
  
    
  
    // confirmSelection() {
    //   if (this.selectedStartDate && !this.selectedEndDate) {
    //     this.selectedEndDate = new Date(this.selectedStartDate.getTime()); 
    //     this.selectedStartDate = null; 
    //   }
  
    //   if (this.allowSingleDateSelection) {
    //     if (!this.selectedEndDate) {
    //       return; 
    //     }
    //   } else {
    //     if (!this.selectedStartDate || !this.selectedEndDate) {
    //       console.error('Both start and end dates must be selected.');
    //       return;
    //     }
    //   }
    //   this.selectedStartDateChange.emit(this.selectedStartDate);
    //   this.selectedEndDateChange.emit(this.selectedEndDate);
    //   this.updateInputField();  
    //   this.calendarVisible = false;
    // }
    confirmSelection() {
      if (this.selectedStartDate) {
        this.selectedStartDateChange.emit(this.selectedStartDate);
        this.dateRangeString = this.formatDate(this.selectedStartDate);
        this.calendarVisible = false;
      }
    }
    
    // updateInputField() {
    //   if (this.selectedStartDate && this.selectedEndDate) {
    //     this.dateRangeString = `${this.formatDate(this.selectedStartDate)} - ${this.formatDate(this.selectedEndDate)}`;
    //   } else if (this.selectedEndDate) {
    //     this.dateRangeString = this.formatDate(this.selectedEndDate); 
    //   }
    // }
    updateInputField() {
      if (this.selectedStartDate) {
        this.dateRangeString = this.formatDate(this.selectedStartDate);
      } else {
        this.dateRangeString = '';
      }
    }
    
    
    formatDate(date: Date): string {
      const day = this.selectedLang === 'bn'
        ? this.convertToBanglaNumber(date.getDate())
        : date.getDate();
    
      const month = this.selectedLang === 'bn'
        ? this.months[date.getMonth()]
        : this.months[date.getMonth()];
    
      const year = this.selectedLang === 'bn'
        ? this.convertToBanglaNumber(date.getFullYear())  
        : date.getFullYear();
      
      return `${month} ${day}, ${year}`;
    }
    
    
    
    onStartDateChange(date: Date | null) {
      // Removed for production
      this.selectedStartDate = date;
      this.selectedStartDateChange.emit(this.selectedStartDate);
    }
    
    onEndDateChange(date: Date | null) {
      // Removed for production
      this.selectedEndDate = date;
      this.selectedEndDateChange.emit(this.selectedEndDate);
    }
    
  
    toggleCalendar() {
      this.calendarVisible = !this.calendarVisible;
      if (this.calendarVisible) {
        this.addGlobalClickListener();
      } else {
        this.removeGlobalClickListener();
      }
    }
  
    private addGlobalClickListener() {
    if (!this.globalClickUnlistener) {
      this.globalClickUnlistener = this.renderer.listen('document', 'click', (event: Event) => {
        const clickedInside = this.elRef.nativeElement.contains(event.target);
        
        if (!clickedInside) {
          this.calendarVisible = false;
          this.showStartMonthDropdown = false;
          this.showStartYearDropdown = false;
          this.showEndMonthDropdown = false;
          this.showEndYearDropdown = false;
          this.removeGlobalClickListener();
        } else {
          // Cierra dropdowns individuales si el clic fue fuera de ellos específicamente
          const targetElement = event.target as HTMLElement;
          if (
            !targetElement.closest('.start-month-dropdown') &&
            !targetElement.closest('.start-year-dropdown')
          ) {
            this.showStartMonthDropdown = false;
            this.showStartYearDropdown = false;
          }
          if (
            !targetElement.closest('.end-month-dropdown') &&
            !targetElement.closest('.end-year-dropdown')
          ) {
            this.showEndMonthDropdown = false;
            this.showEndYearDropdown = false;
          }
        }
      });
    }
  }
  
  
    private removeGlobalClickListener() {
      if (this.globalClickUnlistener) {
        this.globalClickUnlistener();
        this.globalClickUnlistener = null;
      }
    }
  
    ngOnDestroy() {
      this.removeGlobalClickListener();
    }
  
    toggleYearMonth(type: 'start' | 'end') {
      this.yearMonthSelectorVisible[type] = !this.yearMonthSelectorVisible[type];
    }
  
    previousMonth(type: 'start' | 'end') {
      if (type === 'start') {
        if (this.startCurrentMonth === 0) {
          this.startCurrentMonth = 11;
          this.startCurrentYear--;
        } else {
          this.startCurrentMonth--;
        }
      } else {
        if (this.endCurrentMonth === 0) {
          this.endCurrentMonth = 11;
          this.endCurrentYear--;
        } else {
          this.endCurrentMonth--;
        }
      }
      this.generateDaysInMonth(this.startCurrentYear, this.startCurrentMonth, 'start');
      this.generateDaysInMonth(this.endCurrentYear, this.endCurrentMonth, 'end');
    }
  
  
    nextMonth(type: 'start' | 'end') {
      if (type === 'start') {
        if (this.startCurrentMonth === 11) {
          this.startCurrentMonth = 0;
          this.startCurrentYear++;
        } else {
          this.startCurrentMonth++;
        }
      } else {
        if (this.endCurrentMonth === 11) {
          this.endCurrentMonth = 0;
          this.endCurrentYear++;
        } else {
          this.endCurrentMonth++;
        }
      }
      this.generateDaysInMonth(this.startCurrentYear, this.startCurrentMonth, 'start');
      this.generateDaysInMonth(this.endCurrentYear, this.endCurrentMonth, 'end');
    }
  
    // generateDaysInMonth(year: number, month: number, type: 'start' | 'end') {
    //   const firstDayOfMonth = new Date(year, month, 1);
    //   const daysInMonth = new Date(year, month + 1, 0).getDate();
    //   const days: (Date | null)[] = [];
    //   const firstDay = firstDayOfMonth.getDay();
    //   for (let i = 0; i < firstDay; i++) {
    //     days.push(null);
    //   }
    //   for (let i = 1; i <= daysInMonth; i++) {
    //     const date = new Date(Date.UTC(year, month, i)); 
    //     days.push(date);
    //   }
    
    //   const remainingDays = (days.length % 7 === 0) ? 0 : 7 - (days.length % 7);
    //   for (let i = 0; i < remainingDays; i++) {
    //     days.push(null);
    //   }
    
    //   if (type === 'start') {
    //     this.startDaysInMonth = days;
    //   } else {
    //     this.endDaysInMonth = days;
    //   }
    // }

    generateDaysInMonth(year: number, month: number, type: 'start' | 'end') {
      const days: (Date | null)[] = [];
    
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const startDayIndex = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
    
      const daysInPrevMonth = new Date(year, month, 0).getDate();
    
      // Previous month's days
      for (let i = startDayIndex - 1; i >= 0; i--) {
        const prevDate = new Date(Date.UTC(year, month - 1, daysInPrevMonth - i));
        days.push(prevDate);
      }
    
      // Current month days
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const currentDate = new Date(Date.UTC(year, month, i));
        days.push(currentDate);
      }
    
      // Next month's days to complete 42 days
      while (days.length < 42) {
        const nextDate = new Date(Date.UTC(year, month, lastDayOfMonth.getDate() + (days.length - startDayIndex - lastDayOfMonth.getDate()) + 1));
        days.push(nextDate);
      }
    
      if (type === 'start') {
        this.startDaysInMonth = days;
      } else {
        this.endDaysInMonth = days;
      }
    }
    
    
  
  
    clearSelection() {
      this.tempStartDate = null;
      this.tempEndDate = null;
      this.selectedStartDate = null; 
      this.selectedEndDate = null;  
      this.dateRangeString = '';
      this.selectedStartDateChange.emit(null);
      this.calendarVisible = true; 
    }
    
  
  
    cancelSelection() {
      this.tempStartDate = null;
      this.tempEndDate = null;
      this.selectedStartDate = null; 
  
      this.dateRangeString = '';
      this.selectedStartDateChange.emit(null);

      this.calendarVisible = false; 
    }
    
    
   
    
    notifyClearEvent() {
      this.selectedStartDateChange.emit();
    }
  
    selectDate(date: Date) {
      this.selectedStartDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      this.tempStartDate = this.selectedStartDate;
      this.updateInputField();
      this.selectedStartDateChange.emit(this.selectedStartDate);
      this.calendarVisible = false; // auto close calendar
    }
    
    isSelected(date: Date): boolean {
      return (
        (this.selectedStartDate && date.getTime() === this.selectedStartDate.getTime()) 
      ) || false;  
    }
    
    isInRange(date: Date): boolean {
      if (this.selectedStartDate) {
        return date >= this.selectedStartDate;
      }
      return false;
    }
    
    isDisabled(date: Date): boolean {
      return false; 
    }

}

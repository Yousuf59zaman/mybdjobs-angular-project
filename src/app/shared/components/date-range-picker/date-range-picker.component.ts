
import {  CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-range-picker',
  imports: [NgClass,FormsModule],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss'
})
export class DateRangePickerComponent {
  @Input() selectedStartDate: Date | null = null;
  @Input() selectedEndDate: Date | null = null;
  @Input() allowSingleDateSelection: boolean = true;
  @Output() selectedStartDateChange = new EventEmitter<Date | null>();
  @Output() selectedEndDateChange = new EventEmitter<Date | null>();
  @Output() onConfirmSelection = new EventEmitter<void>();
  @Output() onCancelSelection = new EventEmitter<void>();
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




toggleYearDropdown(type: 'start' | 'end') {
  if (type === 'start') {
    this.showStartYearDropdown = !this.showStartYearDropdown;
    this.showStartMonthDropdown = false;
  } else {
    this.showEndYearDropdown = !this.showEndYearDropdown;
    this.showEndMonthDropdown = false;
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
  const startYear = 1971;
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

  

  confirmSelection() {
    if (this.selectedStartDate && !this.selectedEndDate) {
      this.selectedEndDate = new Date(this.selectedStartDate.getTime()); 
      this.selectedStartDate = null; 
    }

    if (this.allowSingleDateSelection) {
      if (!this.selectedEndDate) {
        return; 
      }
    } else {
      if (!this.selectedStartDate || !this.selectedEndDate) {
        console.error('Both start and end dates must be selected.');
        return;
      }
    }
    this.selectedStartDateChange.emit(this.selectedStartDate);
    this.selectedEndDateChange.emit(this.selectedEndDate);
    this.updateInputField();  
    this.calendarVisible = false;
    this.onConfirmSelection.emit();

  }
  
  updateInputField() {
    if (this.selectedStartDate && this.selectedEndDate) {
      this.dateRangeString = `${this.formatDate(this.selectedStartDate)} - ${this.formatDate(this.selectedEndDate)}`;
    } else if (this.selectedEndDate) {
      this.dateRangeString = this.formatDate(this.selectedEndDate); 
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
    console.log('Start date changed:', date);
    this.selectedStartDate = date;
    this.selectedStartDateChange.emit(this.selectedStartDate);
  }
  
  onEndDateChange(date: Date | null) {
    console.log('End date changed:', date);
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

  generateDaysInMonth(year: number, month: number, type: 'start' | 'end') {
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (Date | null)[] = [];
    const firstDay = firstDayOfMonth.getDay();
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(Date.UTC(year, month, i)); 
      days.push(date);
    }
  
    const remainingDays = (days.length % 7 === 0) ? 0 : 7 - (days.length % 7);
    for (let i = 0; i < remainingDays; i++) {
      days.push(null);
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
    this.selectedEndDateChange.emit(null);
    this.calendarVisible = true; 
  }
  


  cancelSelection() {
    this.tempStartDate = null;
    this.tempEndDate = null;
    this.selectedStartDate = null; 
    this.selectedEndDate = null;  
    this.dateRangeString = '';
    this.selectedStartDateChange.emit(null);
    this.selectedEndDateChange.emit(null);
    this.calendarVisible = false; 
     this.onCancelSelection.emit();
  }
  
  
 
  
  notifyClearEvent() {
    this.selectedStartDateChange.emit();
    this.selectedEndDateChange.emit();
  }

  selectDate(date: Date) {
    if (!this.selectedStartDate || (this.selectedEndDate && date < this.selectedStartDate)) {
      this.selectedStartDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      this.selectedEndDate = null;
    } else if (!this.selectedEndDate || date > this.selectedStartDate) {
      this.selectedEndDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    }
    this.tempStartDate = this.selectedStartDate;
    this.tempEndDate = this.selectedEndDate;
    this.updateInputField();
  }
  
  isSelected(date: Date): boolean {
    return (
      (this.selectedStartDate && date.getTime() === this.selectedStartDate.getTime()) ||
      (this.selectedEndDate && date.getTime() === this.selectedEndDate.getTime())
    ) || false;  
  }
  
  isInRange(date: Date): boolean {
    if (this.selectedStartDate && this.selectedEndDate) {
      return date >= this.selectedStartDate && date <= this.selectedEndDate;
    }
    return false;
  }
  
  isDisabled(date: Date): boolean {
    return false; 
  }




getStartCalendarDays(): (Date | null)[] {
  const firstDayOfMonth = new Date(this.startCurrentYear, this.startCurrentMonth, 1);
  const daysInMonth = new Date(this.startCurrentYear, this.startCurrentMonth + 1, 0).getDate();
  
  const prevMonthDays = firstDayOfMonth.getDay();
  const prevMonth = this.startCurrentMonth === 0 ? 11 : this.startCurrentMonth - 1;
  const prevYear = this.startCurrentMonth === 0 ? this.startCurrentYear - 1 : this.startCurrentYear;
  const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
  
  const days: (Date | null)[] = [];

  for (let i = prevMonthLastDay - prevMonthDays + 1; i <= prevMonthLastDay; i++) {
    days.push(new Date(prevYear, prevMonth, i));
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(this.startCurrentYear, this.startCurrentMonth, i));
  }
  
  const nextMonthDays = 42 - days.length; 
  const nextMonth = this.startCurrentMonth === 11 ? 0 : this.startCurrentMonth + 1;
  const nextYear = this.startCurrentMonth === 11 ? this.startCurrentYear + 1 : this.startCurrentYear;
  
  for (let i = 1; i <= nextMonthDays; i++) {
    days.push(new Date(nextYear, nextMonth, i));
  }
  
  return days;
}

getEndCalendarDays(): (Date | null)[] {
  const firstDayOfMonth = new Date(this.endCurrentYear, this.endCurrentMonth, 1);
  const daysInMonth = new Date(this.endCurrentYear, this.endCurrentMonth + 1, 0).getDate();

  const prevMonthDays = firstDayOfMonth.getDay();
  const prevMonth = this.endCurrentMonth === 0 ? 11 : this.endCurrentMonth - 1;
  const prevYear = this.endCurrentMonth === 0 ? this.endCurrentYear - 1 : this.endCurrentYear;
  const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
  
  const days: (Date | null)[] = [];
  
  for (let i = prevMonthLastDay - prevMonthDays + 1; i <= prevMonthLastDay; i++) {
    days.push(new Date(prevYear, prevMonth, i));
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(this.endCurrentYear, this.endCurrentMonth, i));
  }
  
  const nextMonthDays = 42 - days.length; 
  const nextMonth = this.endCurrentMonth === 11 ? 0 : this.endCurrentMonth + 1;
  const nextYear = this.endCurrentMonth === 11 ? this.endCurrentYear + 1 : this.endCurrentYear;
  
  for (let i = 1; i <= nextMonthDays; i++) {
    days.push(new Date(nextYear, nextMonth, i));
  }
  
  return days;
}

isStartDate(date: Date): boolean {
  return this.selectedStartDate ? date.toDateString() === this.selectedStartDate.toDateString() : false;
}

isEndDate(date: Date): boolean {
  return this.selectedEndDate ? date.toDateString() === this.selectedEndDate.toDateString() : false;
}

isAdjacentMonth(date: Date, type: 'start' | 'end'): boolean {
  if (type === 'start') {
    return date.getMonth() !== this.startCurrentMonth || date.getFullYear() !== this.startCurrentYear;
  } else {
    return date.getMonth() !== this.endCurrentMonth || date.getFullYear() !== this.endCurrentYear;
  }
}

}
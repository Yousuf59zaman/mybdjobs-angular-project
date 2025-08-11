import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, computed, DestroyRef, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard-modal',
  imports: [
    NgClass,
    TranslocoModule,
    CommonModule,
    ReactiveFormsModule,
    DatePipe
  ],
  providers:[provideTranslocoScope('dashboard')],
  templateUrl: './dashboard-modal.component.html',
  // styleUrl: './dashboard-modal.component.scss'
})
export class DashboardModalComponent {
  
  private destroyRef = inject(DestroyRef);
  private toastr = inject(ToastrService);

  modalType = input('');
  description = input('');
  packageEndDateString = input('');

  @Output() cancelEmitter = new EventEmitter<boolean>();
  
  modalTitle = signal('dashboard.planRenewRepurchase');
  subscriptionType = new FormControl('');

  purchaseOptions = signal([
    { value: 'renew', label: 'Renew', subLabel: 'Starts from ' },
    { value: 'repurchase', label: 'Repurchase', subLabel: 'Starts from today' }
  ]);

  remainingDaysForPackage = computed(
    () => Math.ceil((new Date(this.packageEndDateString()).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  )

  onCancel() {
    this.cancelEmitter.emit(true);
  }

  onClickConfirm() {
    window.location.href = `https://mybdjobs.bdjobs.com/bdjobs-pro/bdjobs-pro-package-pricing?pt=${
      this.modalType() === 'up'
        ? 'up'
        : 'rep'
    }`
  }

  subscriptionValueChange = this.subscriptionType.valueChanges
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(
      (val) => {
        if(val === 'renew' && this.remainingDaysForPackage() > 7) {
          this.toastr.warning('Text tomorrow!');
        }
      }
    )
}

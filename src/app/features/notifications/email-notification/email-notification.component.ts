import { Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-notification',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './email-notification.component.html',
  styleUrl: './email-notification.component.scss'
})
export class EmailNotificationComponent {

  destroyRef = inject(DestroyRef);
  toastr = inject(ToastrService);

  isHotJobNotification = new FormControl;
  isTrainingNotification = new FormControl;
  isPromotionNotification = new FormControl;
  isNewsletterNotification = new FormControl;

  controlHotJob = computed(
    ()=> this.isHotJobNotification as FormControl<boolean>
  )
  controlTraining = computed(
    ()=> this.isTrainingNotification as FormControl<boolean>
  )
  controlPromotion = computed(
    ()=> this.isPromotionNotification as FormControl<boolean>
  )
  controlNewsletter = computed(
    ()=> this.isNewsletterNotification as FormControl<boolean>
  )

  constructor() {
    this.controlHotJob().valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (val) => {
          // value change might call api for data update;
        }
      );
    this.controlTraining().valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (val) => {
          // value change might call api for data update;
        }
      );
    this.controlPromotion().valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (val) => {
          // value change might call api for data update;
        }
      );
    this.controlNewsletter().valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (val) => {
          // value change might call api for data update;
        }
      );

  }
}

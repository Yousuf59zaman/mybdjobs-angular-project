import { NgClass } from '@angular/common';
import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-promo-code',
  imports: [
    NgClass
  ],
  templateUrl: './promo-code.component.html',
  styleUrl: './promo-code.component.scss'
})
export class PromoCodeComponent {

  isSelectedAvailableList = signal(true);
  availableCount = signal(11);
  expiredCount = signal(7);
  promoTitle = signal('RUHAMA25');
  availablePromoCodeList = signal([]);
  expiredPromoCodeList = signal([]);
  isPromoUsed = signal(true);

  @Input() onConfirm!: (promoCodetitle: string) => void;

  onClickCopyTitle(id: string) {}

}

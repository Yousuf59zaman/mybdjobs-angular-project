import { Component, inject, input, signal } from '@angular/core';
import { NumericOnlyDirective } from '../../../core/directives/numeric-only.dir';
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AccordionManagerService } from '../../../shared/services/accordion.service';
import { ModalService } from '../../../core/services/modal/modal.service';
import { PromoCodeComponent } from '../promo-code/promo-code.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export interface OtherPaymentMethod {
  methodId: number;
  isMethodSelected: boolean;
  methodLogo: string;
  methodTitle: string;
}

@Component({
  selector: 'app-payment',
  imports: [
    NumericOnlyDirective,
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {

  private toastr = inject(ToastrService);
  private accordionService = inject(AccordionManagerService);
  private modalService = inject(ModalService);

  isAllowedUnitPurchase = input(false);

  packageTitle = signal('Bdjobs Pro (Standard)');
  packageUnitCount = signal(0);
  packageAmount = signal(0);
  packageDuration = signal(30);
  subTotalAmount = signal(0);
  payableTotalAmount = signal(100);
  pointRedeemable = signal(5048);
  pointRedeemAmount = signal(10);
  selectedPaymentMethod = signal<'bkash' | 'card' | 'other'>('bkash');
  controlPromo: FormControl<string> = new FormControl();
  proceedId = 'proceedWarning';
  otherPaymentMethods = signal<OtherPaymentMethod[]>([
    {
      isMethodSelected: true,
      methodLogo: '',
      methodTitle: 'Nagad',
      methodId: 0
    },
    {
      isMethodSelected: false,
      methodLogo: '',
      methodTitle: 'Rocket',
      methodId: 1
    },
    {
      isMethodSelected: false,
      methodLogo: '',
      methodTitle: 'City Touch',
      methodId: 2
    },
    {
      isMethodSelected: false,
      methodLogo: '',
      methodTitle: 'Brac Bank',
      methodId: 3
    },
    {
      isMethodSelected: false,
      methodLogo: '',
      methodTitle: 'Cellfin',
      methodId: 4
    },
    {
      isMethodSelected: false,
      methodLogo: '',
      methodTitle: 'MTB',
      methodId: 5
    },
    {
      isMethodSelected: false,
      methodLogo: '',
      methodTitle: 'Islami Bank',
      methodId: 6
    },
    {
      isMethodSelected: false,
      methodLogo: '',
      methodTitle: 'Payza',
      methodId: 7
    },
    {
      isMethodSelected: false,
      methodLogo: '',
      methodTitle: 'AB Bank',
      methodId: 8
    },
  ])

  onClickAllPromo() {
    this.modalService.setModalConfigs({
      attributes: {
        modalWidth: '760px',
      },
      inputs: {
        onConfirm: (promoTitle: string)=> this.onConfirmAppliedPromo(promoTitle)
      },
      componentRef:PromoCodeComponent
    })
  }

  onClickPaymentMethod(methodId: number) {
    switch (methodId) {
      case 1:
        this.selectedPaymentMethod.set('bkash');
        break;
      case 2:
        this.selectedPaymentMethod.set('card');
        break;
      case 3:
        this.selectedPaymentMethod.set('other');
        break;
      default:
        this.selectedPaymentMethod.set('bkash');
        break;
    }
  }

  onClickConfirmPaynent() {
    this.toastr.info('Will be implemented','In Progress!');
  }

  onClickOtherPaymentMethod(methodId: number) {
    this.otherPaymentMethods.set(
      this.otherPaymentMethods().map(
        method => {
          return {
            ...method,
            isMethodSelected: method.methodId === methodId,
          }
        }
      )
    );
  }

  isOpen() {
    return this.accordionService.isOpen(this.proceedId)();
  }

  toggle() {
    this.accordionService.toggle(this.proceedId);
  }

  onConfirmAppliedPromo(promoTitle: string) {
    this.toastr.info(promoTitle);
    this.controlPromo.setValue(promoTitle);
    this.modalService.closeModal();
  }

}

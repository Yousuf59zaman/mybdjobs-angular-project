import { Component, inject } from '@angular/core';
import { ModalService } from '../../../core/services/modal/modal.service';


@Component({
  selector: 'app-custom-validation-alert',
  imports: [],
  templateUrl: './custom-validation-alert.component.html',
  styleUrl: './custom-validation-alert.component.scss'
})
export class CustomValidationAlertComponent {
  private modalService = inject(ModalService)

  dismiss(){
    this.modalService.closeModal();
  }

}

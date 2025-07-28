import { Component, inject, signal } from '@angular/core';
import { NumericOnlyDirective } from '../../../core/directives/numeric-only.dir';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalService } from '../../../core/services/confirmationModal/confirmation-modal.service';

@Component({
  selector: 'app-delete-resume',
  imports: [NumericOnlyDirective],
  templateUrl: './delete-resume.component.html',
  styleUrl: './delete-resume.component.scss'
})
export class DeleteResumeComponent {
  private toastr = inject(ToastrService);
  private confirmModal = inject(ConfirmationModalService);

  profileUsername = signal('hellonafiul');

  onClickTogglePassword() {
    this.toastr.info('Yet to implement!');
  }

  onClickConfirmDelete() {
    // Configure the modal exactly like your design
    this.confirmModal.openModal({
      content: {
        title: 'Are you sure you want to Delete this Resume?',
        content:
          'If you agree, the resume will be removed from your collection and cannot be restored.',
        closeButtonText: 'No, Keep it',
        saveButtonText: 'Yes, Continue',
        isCloseButtonVisible: true,
        isSaveButtonVisible: true
      }
    })
    .subscribe(({ event }) => {
      if (event?.isConfirm) {
        this.deleteResume();            // <- proceed with API call
      } else {
        this.toastr.info('Deletion cancelled.');
      }
    });
  }

  // Your actual delete flow
  private deleteResume() {
    // TODO: call API, then:
    this.toastr.success('Resume deleted successfully.');
  }
}

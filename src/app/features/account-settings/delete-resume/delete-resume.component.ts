import { Component, inject, signal } from '@angular/core';
import { NumericOnlyDirective } from '../../../core/directives/numeric-only.dir';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-resume',
  imports: [
    NumericOnlyDirective
  ],
  templateUrl: './delete-resume.component.html',
  styleUrl: './delete-resume.component.scss'
})
export class DeleteResumeComponent {

  toastr = inject(ToastrService);

  profileUsername = signal('hellonafiul');

  onClickTogglePassword() {
    this.toastr.info('Yet to implement!');
  }

  onClickConfirmDelete() {}
}

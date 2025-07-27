import { Component, inject, input, signal, SimpleChanges } from '@angular/core';
import { AccordionManagerService } from '../../../../../../shared/services/accordion.service';
import { LinkAccountService } from './service/link-account.service';
import { SelectboxComponent } from "../../../../../../shared/components/selectbox/selectbox.component";
import { AccordionMainBodyComponent } from "../../../../../../shared/components/accordion-main-body/accordion-main-body.component";
import { NoDetailsComponent } from "../../../../../../shared/components/no-details/no-details.component";
import { DeleteLinkPayload, InsertLinkPayload, LinkQuery, LinkResponse, UpdateLinkPayload } from '../model/linkAccount';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from "../../../../../../shared/components/input/input.component";
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { CookieService } from '../../../../../../core/services/cookie/cookie.service';

@Component({
  selector: 'app-link-account',
  imports: [SelectboxComponent, AccordionMainBodyComponent, NoDetailsComponent, InputComponent, ReactiveFormsModule, CommonModule, TranslocoModule],
  providers: [provideTranslocoScope('editResumeLinkAccount')],
  templateUrl: './link-account.component.html',
  styleUrl: './link-account.component.scss'
})
export class LinkAccountComponent {

  private accordionService = inject(AccordionManagerService);
  private linkAccountService = inject(LinkAccountService);
  private cookieService = inject(CookieService);
  isLinkAccountOpen = input(false);
  isFormOpen = signal(false);
  isDeleteModalOpen = signal(false);
  accountToDelete: number | null = null;
  editingAccount: any = null;
  isInfoAvailable = true;
  isLoading = false;
  linkAccount: LinkResponse[] = [];



  ngOnChanges(changes: SimpleChanges): void {
    if (this.isLinkAccountOpen() && !this.isOpen()) {
      this.toggle();
    }
    if (this.isLinkAccountOpen()) {
      this.loadLinkAccountInfo();
    }
  }
  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }


  toggle() {
    const willOpen = !this.accordionService.isOpen(this.id)();
    this.accordionService.toggle(this.id);
    if (willOpen) {
      this.loadLinkAccountInfo();
    }
  }

  linkedAccounts: LinkResponse[] = [];

  nextId = 3;

  linkFrom = new FormGroup({
    profileId: new FormControl<number | null>(null),
    platform: new FormControl<string>('', [Validators.required]),
    url: new FormControl<string>('', [Validators.required, Validators.pattern('https?://.+')]),
  });


  platformOptions = signal([
    {
      label: 'LinkedIn',
      value: 'LinkedIn',
      icon: 'images/Social icon-2.svg'
    },
    {
      label: 'GitHub',
      value: 'GitHub',
      icon: 'images/Social icon-1.svg'
    },
    {
      label: 'Facebook',
      value: 'Facebook',
      icon: 'images/Social icon.svg'
    },
    {
      label: 'YouTube',
      value: 'YouTube',
      icon: 'images/Social icon-3.svg'
    },
    {
      label: 'Dribbble',
      value: 'Dribbble',
      icon: 'images/Social icon-4.svg'
    },
    {
      label: 'Other',
      value: 'Other',
      icon: 'images/more-horizontal-circle-02-stroke-rounded 1.svg'
    }
  ]);

  private id = "linkaccounts";

  openForm() {
    this.isFormOpen.set(true);
    this.editingAccount = null;
    this.linkFrom.reset();
  }
  closeForm() {
    this.isFormOpen.set(false);
    this.linkFrom.reset();
  }

  editAccount(account: LinkResponse) {
    this.isFormOpen.set(true);
    this.editingAccount = account;

    this.linkFrom.setValue({
      profileId: account.otherProfileId,
      platform: account.profileType,
      url: account.profileUrl
    });

    this.platformControl.updateValueAndValidity();
  }
  toggleForm() {
    this.isFormOpen.set(!this.isFormOpen());
    if (!this.isFormOpen()) {
      this.linkFrom.reset();
      this.editingAccount = null;
    }
  }
  ngOnInit(): void {
    // this.loadLinkAccountInfo();
  }

  loadLinkAccountInfo(): void {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || ''; // for development only
    const userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
    console.log('User GUID ID Photo Component:', userGuidId);

    this.isLoading = true;
    const query: LinkQuery = {
      UserGuid: userGuidId ?? ""
    }
    this.linkAccountService.getLinkInfo(query).subscribe({
      next: (summaries) => {
        this.linkAccount = summaries;
        this.isInfoAvailable = summaries && summaries.length > 0;
        this.isLoading = false;
      },
      error: (error) => {
        this.isInfoAvailable = false;
        this.isLoading = false;
      }
    });
  }



  cancelEdit() {
    this.editingAccount = null;
    this.loadLinkAccountInfo();
    this.closeForm();
    //this.linkFrom.reset();
  }


  getPlatformIcon(profileType: string): string {
    const iconMap: { [key: string]: string } = {
      'LinkedIn': 'images/Social icon-2.svg',
      'GitHub': 'images/Social icon-1.svg',
      'Facebook': 'images/Social icon.svg',
      'YouTube': 'images/Social icon-3.svg',
      'Dribbble': 'images/Social icon-4.svg',
      'Other': 'images/more-horizontal-circle-02-stroke-rounded 1.svg',
      'Others': 'images/more-horizontal-circle-02-stroke-rounded 1.svg'
    };
    return iconMap[profileType] || 'images/more-horizontal-circle-02-stroke-rounded 1.svg';
  }


  saveAccount() {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || ''; // for development only
    const userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
    console.log('User GUID ID Photo Component:', userGuidId);
    if (this.linkFrom.invalid) {
      this.linkFrom.markAllAsTouched();
      return;
    }

    const formValue = this.linkFrom.value;
    if (!formValue.platform || !formValue.url) return;

    if (this.editingAccount) {
      // Update existing account
      const updateLink: UpdateLinkPayload = {
        userGuid: userGuidId ?? "",
        otherProfileId: this.editingAccount.otherProfileId,
        profile_Type: formValue.platform,
        profile_Url: formValue.url
      };
      this.linkAccountService.updateLinkInfo(updateLink).subscribe({
        next: (response: LinkResponse) => {
          this.loadLinkAccountInfo();
          this.editingAccount = null; // Clear editing state
          this.closeForm(); // Close the form
        },
        error: (error) => {
          console.error('Update failed:', error);
        }
      });
    } else {
      // Insert new account
      const insertLink: InsertLinkPayload = {
        userGuid: userGuidId ?? "",
        profile_Type: formValue.platform,
        profile_URL: formValue.url
      };
      this.linkAccountService.insertLinkInfo(insertLink).subscribe({
        next: (response: LinkResponse) => {
          this.loadLinkAccountInfo();
          this.closeForm();
        },
        error: (error) => {
          console.error('Insert failed:', error);
        }
      });
    }
  }




  deleteSummary(otherProfileId: number) {
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') || ''; // for development only
    const userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
    console.log('User GUID ID Photo Component:', userGuidId);

    const deleteCommand: DeleteLinkPayload = {
      userGuid: userGuidId ?? "",
      otherProfileId: otherProfileId
    };

    this.linkAccountService.deleteLinkInfo(deleteCommand).subscribe({
      next: () => {
        this.linkAccount = this.linkAccount.filter(a => a.otherProfileId !== this.accountToDelete);
        if (this.editingAccount?.otherProfileId === otherProfileId) {
          this.closeForm();
          this.loadLinkAccountInfo();
        }
      },
      error: (err) => {
        console.error('Failed to delete training summary', err);
        alert('An error occurred while deleting. Please try again.');
      }
    });
  }

  openDeleteModal(profileId: number) {
    this.accountToDelete = profileId;
    this.isDeleteModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }


  confirmDelete() {
    if (this.accountToDelete !== null) {
      this.deleteSummary(this.accountToDelete);
      this.closeDeleteModal()
    }
  }


  closeDeleteModal() {
    this.accountToDelete = null;
    this.isDeleteModalOpen.set(false);
  }
  resetForm() {
    this.linkFrom.reset();
    this.editingAccount = null;
  }

  get platformControl(): FormControl {
    return this.linkFrom.get('platform') as FormControl;
  }
  get urlControl(): FormControl {
    return this.linkFrom.get('url') as FormControl;
  }
}

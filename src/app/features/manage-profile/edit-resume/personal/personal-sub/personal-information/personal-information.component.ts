import { NgClass, CommonModule, DatePipe } from '@angular/common';
import { Component, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { PersonalInformationService } from '../services/personal-information.service';
import { EventDataValue, SelectItem } from '../models/personal-info-model';
import { finalize } from 'rxjs';
import { AccordionManagerService } from '../../../../../../shared/services/accordion.service';
import { NoDetailsComponent } from '../../../../../../shared/components/no-details/no-details.component';
import { PersonalDetailsFormComponent } from '../PersonalDetailsForm/personal-details-form/personal-details-form.component';
import { AccordionMainBodyComponent } from "../../../../../../shared/components/accordion-main-body/accordion-main-body.component";
import { provideTranslocoScope, translate, TranslocoModule } from '@jsverse/transloco';
import { CookieService } from '../../../../../../core/services/cookie/cookie.service';


@Component({
  selector: 'app-personal-information',
  providers: [provideTranslocoScope('personal')],
  imports: [
    PersonalDetailsFormComponent,
    NoDetailsComponent,
    DatePipe,
    AccordionMainBodyComponent,
    TranslocoModule,
],
  templateUrl: './personal-information.component.html',
  styleUrl: './personal-information.component.scss',
})
export class PersonalInformationComponent implements OnChanges {
  isPersonalDetailsOpen = input(false);
  isPersonalFormOpen = signal(false);
  isDeleteModalOpen = signal(false);
  imgAvailable = signal(true);
  isInfoAvailable = signal(true);
  private id = 'personal';
  private accordionService = inject(AccordionManagerService);
  private personalInfoService = inject(PersonalInformationService);
  personalInfo: EventDataValue | null = null;
  profilePhotoUrl: string = '';
  isLoading = signal(true);
  isBlue = false;
  userGuid: string | null = null;

  private cookieService = inject(CookieService);

  ngOnInit(): void {
    const accountType = this.cookieService.getCookie('IsBlueCaller');
    if (accountType === 'True') {
      this.isBlue = true;
    } else {
      this.isBlue = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.isPersonalDetailsOpen() && !this.isOpen()) {
      const willOpen = !this.accordionService.isOpen(this.id)();
      this.toggle();
      if(willOpen)
      {
        this.loadPersonalInfo();
      }

    }
  }

  genderOptions: SelectItem[] = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Others', value: 'O' },
  ];

  maritalStatusOptions: SelectItem[] = [
    { label: 'Unmarried', value: '0' },
    { label: 'Married', value: '1' },
    { label: 'Single', value: '2' },
  ];
  handleAfterSave(): void {
    this.loadPersonalInfo();
  }
  loadPersonalInfo(): void {
    // const UserGuid = 'ZRDhZ7YxZEYyITPbBQ00PFPiMTDhBTUyPRmbPxdxYiObIFZ9BFPtBFVUIGL3Ung=';
    const rawGuid = this.cookieService.getCookie('MybdjobsGId') // for development only

    if (!rawGuid) {
      console.error('User Guid is not available');
    } else {
      console.log('User Guid:', rawGuid);
    }
    this.userGuid = rawGuid ? decodeURIComponent(rawGuid) : null;

    console.log('Decoded User Guid:', this.userGuid);

    const isCvPosted = 1;
    this.personalInfoService
      .getPersonalInfo(this.userGuid ?? '', isCvPosted)
      .pipe(finalize(() => this.isLoading.update(() => false)))
      .subscribe((response) => {
        const successData = response.event.eventData.find(
          (d) => d.key === 'message'
        );
        if (successData && successData.value.isSuccess === false) {
          this.personalInfo = successData.value;
        }
        this.profilePhotoUrl = `https://storage.googleapis.com/bdjobs/mybdjobs/photos${this.personalInfo?.photo}`;
        if (this.personalInfo?.photo == null) {
          this.imgAvailable.set(false);
        }
      });
  }

    onExpandClick() {
    const willOpen = !this.accordionService.isOpen(this.id)();
    this.toggle(); // toggles the accordion

    if (willOpen) {
      this.loadPersonalInfo();
    }
  }

  getGenderLabel(): string {
    const val = this.personalInfo?.accGender;
    const opt = this.genderOptions.find((o) => o.value === val);
    return opt ? opt.label : '';
  }

  getMaritalStatusLabel(): string {
    const val = this.personalInfo?.m_Status;
    const opt = this.maritalStatusOptions.find((o) => o.value === val);
    return opt ? opt.label : '';
  }

  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    this.accordionService.toggle(this.id);
  }

  openPersonalForm() {
    this.isInfoAvailable.set(false);
    this.isPersonalFormOpen.set(true);
  }

  openDeleteModal() {
    this.isDeleteModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }
  closeDeleteModal() {
    this.isDeleteModalOpen.set(false);
    document.body.style.overflow = '';
  }

  closePersonalDetailsForm() {
    this.isPersonalFormOpen.set(false);
  }
}

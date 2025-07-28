import { ApplicationRef, Component, createComponent, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { EmailCVService } from '../../service/email-cv.service';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { RadioComponent } from '../../../../../shared/components/radio/radio.component';
import { ConfirmationModalService } from '../../../../../core/services/confirmationModal/confirmation-modal.service';
import { DetailsCVComponent } from '../../../../cv/detailsCV/details-cv/details-cv.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-cv',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputComponent, RadioComponent, TranslocoModule],
  providers: [provideTranslocoScope('emailCV')],
  templateUrl: './email-cv.component.html',
  styleUrl: './email-cv.component.scss'
})
export class EmailCVComponent implements OnInit {

  showIframe = false;
  iframeUrl!: SafeResourceUrl;


  Cvmail: FormGroup;
  cvType = [
    { id: '0', name: 'cvType', label: 'Bdjobs Profile (Details)' },
    { id: '1', name: 'cvType', label: 'Bdjobs Profile (Short)' },
    { id: '2', name: 'cvType', label: 'Attach Personalized CV' }
  ]

   constructor(
    private fb: FormBuilder,
    private translocoService: TranslocoService,
    private emailService: EmailCVService,
    private confirmationModalService: ConfirmationModalService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.Cvmail = this.fb.group({
      companyName: new FormControl('', [Validators.required]),
      myEmail: new FormControl('', [Validators.required, Validators.email]),
      subjectType: new FormControl('', [Validators.required]),
      cvType: new FormControl('0', [Validators.required]),
      message: new FormControl('', [Validators.required])
    });

    this.bdjobsProfileControl.valueChanges.subscribe((value: string) => {
      // console.log('Selected CV Type:', value);
    });
  }

  openDetailsCv(event: MouseEvent) {
    event.preventDefault();
    const url = '/jobseeker-panel/details-cv';
    const windowFeatures = 'width=1024,height=768,left=200,top=200,resizable=yes,scrollbars=yes,status=yes';
    window.open(url, '_blank', windowFeatures);
  }

  openShortCv(event: MouseEvent) {
    event.preventDefault();
    const url = '/jobseeker-panel/short-cv';
    const windowFeatures = 'width=1024,height=768,left=200,top=200,resizable=yes,scrollbars=yes,status=yes';
    window.open(url, '_blank', windowFeatures);
  }


  bdjobsProfileFullRadio: any[] = [];
  cvShow : boolean = false;

  ngOnInit() {
    const userId = 241028;
    this.emailService.getUserEmails(userId).subscribe({
      next: users => {
        if (!users.length) return;
        const { name, email } = users[0];
        const displayValue = `${name} <${email}>`;
        this.Cvmail.patchValue({ myEmail: displayValue });
      },
      error: err => console.error(err)
    });
  }

  get companyName(): FormControl {
    return this.Cvmail.get('companyName') as FormControl;
  }

  get myEmail(): FormControl {
    return this.Cvmail.get('myEmail') as FormControl;
  }

  get subjectType(): FormControl {
    return this.Cvmail.get('subjectType') as FormControl;
  }

  get bdjobsProfileControl(): FormControl {
    return this.Cvmail.get('cvType') as FormControl;
  }

  get message(): FormControl {
    return this.Cvmail.get('message') as FormControl;
  }

  showWarningModal(message: string) {
    this.confirmationModalService.openModal({
      content: {
        title: 'Warning',
        content: message,
        closeButtonText: 'Close',
        saveButtonText: '',
        isCloseButtonVisible: true,
        isSaveButtonVisible: false
      }
    });
  }

  async onSubmit() {
    if (this.Cvmail.invalid) {
      if (this.myEmail.invalid) {
        this.showWarningModal('Your email address is left blank! Please type your email address.');
        return;
      }
      if (this.companyName.invalid) {
        this.showWarningModal('Company email address is left blank! Please type company email address.');
        return;
      }
      if (this.subjectType.invalid) {
        this.showWarningModal('Subject is left blank! Please type a subject.');
        return;
      }
      if (this.message.invalid) {
        this.showWarningModal('Message is left blank! Please type your message.');
        return;
      }
      return;
    }

    const formValue = this.Cvmail.value;
    const combined = formValue.myEmail as string;

    const emailMatch = combined.match(/<(.+?)>/);
    //const extractedEmail = emailMatch ? emailMatch[1] : combined;
    const extractedEmail = await this.getComponentHtml();

    const payload = {

      UserId: 241028,
      CompanyEmail: this.companyName,
      MailSubject: this.subjectType,
      UserEmail: this.myEmail,
      CVType: this.cvType,
      JPID: 0,
      Application: this.message,
      isMailSend: true,
      HtmlCV: extractedEmail,
    };
  }

  async  getComponentHtml(): Promise<string> {
    const appRef = inject(ApplicationRef);
    const injector = inject(EnvironmentInjector);

    const componentRef = createComponent(DetailsCVComponent, {
      environmentInjector: injector,
    });

    // Attach to a hidden DOM element
    const element = document.createElement('div');
    document.body.appendChild(element);
    appRef.attachView(componentRef.hostView);
    element.appendChild(componentRef.location.nativeElement);

    // Allow time for Angular to render bindings
    await new Promise((resolve) => setTimeout(resolve));

    const html = element.innerHTML;

    // Cleanup
    appRef.detachView(componentRef.hostView);
    componentRef.destroy();
    document.body.removeChild(element);

    return html;
  }
}

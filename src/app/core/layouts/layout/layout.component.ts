import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
  inject,
  OnInit,
  signal,
  Type,
  ViewChild,
} from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { CircularLoaderService } from '../../services/circularLoader/circular-loader.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from '../../services/modal/modal.service';
import { ModalAttributes } from '../../../shared/utils/app.const';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalService } from '../../services/confirmationModal/confirmation-modal.service';
import { VideoPlayerService } from '../../../shared/services/video-player.service';
import { LocalstorageService } from '../../services/essentials/localstorage.service';
import { JobNoLocalStorage } from '../../../shared/enums/app.enums';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalContainerWoPComponent } from '../../../shared/components/modal-container/modal-container.component';
import { TranslocoService, TranslocoDirective } from '@jsverse/transloco';
import { RightBarComponent } from "../right-bar/right-bar.component";
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LeftBarComponent } from '../left-bar/left-bar.component';
import { filter, map } from 'rxjs';
import { FooterComponent } from '../footer-new/footer.component';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ToasterComponent } from "../../../shared/components/toaster/toaster.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    NavComponent,
    ModalContainerWoPComponent,
    ConfirmationModalComponent,
    ReactiveFormsModule,
    FooterComponent,
    RightBarComponent,
    RouterOutlet,
    SidebarComponent,
    ToasterComponent
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LayoutComponent implements OnInit {
  private circularLoaderService = inject(CircularLoaderService);
  private destroy$ = inject(DestroyRef);
  private modalService = inject(ModalService);
  private confirmationModalService = inject(ConfirmationModalService);
  private videoPlayerService = inject(VideoPlayerService);
  private translocoService = inject(TranslocoService);

  profileImagePath = signal('images/profile-avatar.jpeg');
  isSidebarOpen = signal(true);
  jobNo: string='';
  link: string='';
  isLoading = signal<boolean>(false);
  selectedComponent = signal<Type<any>>(null as any);
  modalAttributes = signal<Record<string, string | boolean>>(ModalAttributes);
  inputs = signal<Record<string, any>>({});
  isEnableMessage = signal<boolean>(false);
  isEnableConfirmation = signal<boolean>(false);
  getModalTitle = signal<string>('');
  getModalContent = signal<string>('');
  isOpen = signal<boolean>(false);
  getOpenButtonText = signal<string>('');
  getCloseButtonText = signal<string>('');
  getSaveButtonText = signal<string>('');
  isClose = signal<boolean>(false);
  showlivebtn:boolean=false;
  examlevel:number=0;
  isPNPLJob=signal<boolean>(false);
  selectedIndex=1;
  priceList= [
    { text: 'Unlock All Contacts', value: 5145 },
    { text: 'Unlocked 5 Contacts', value: 1040 },
    { text: 'Unlocked 10 Contacts', value: 1575 },
    { text: 'Unlocked 15 Contacts', value: 1995 },
    { text: 'Unlocked 20 Contacts', value: 2615 },
  ];
  isPricingSectionVisible=true;
  purchase='You haven’t purchased yet.';

  layout: 'left' | 'right' | 'default' = 'default';


  constructor(
    private localStorageService: LocalstorageService,
    private router  :Router,
    private route: ActivatedRoute,
    //private translocoService: TranslocoService
  ) {
    this.jobNo = this.localStorageService.getItem(JobNoLocalStorage);
    this.link = `https://corporate3.bdjobs.com/onlinetest-dashboard.asp?jobno=${this.jobNo}&pgLevelType=${this.examlevel}`;

    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.route.firstChild;
        while (child?.firstChild) {
          child = child.firstChild;
        }
        return child?.snapshot.data['layout'] || 'default';
      })
    )
    .subscribe(layout => {
      this.layout = layout as any;
    });
  }

  ngOnInit() {
    this.listenOnLoading();
    this.listenOnModal();
    this.listenConfirmationModal();
    this.onClickPriceList();
  }

  private listenOnLoading() {
    this.circularLoaderService.loadingState$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((loading) => {
        this.isLoading.update(() => loading);
      });
  }

  private listenOnModal() {
    this.modalService.modalConfig$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((config) => {
        if (config.isClose) {
          this.isClose.update(() => true);
        } else if (config.componentRef) {
          this.selectedComponent.update(() => config.componentRef);
          this.modalAttributes.update(() => config.attributes);
          this.inputs.update(() => (config.inputs ? config.inputs : {}));
        }
      });
  }

  onCloseEvent(event: boolean) {
    this.selectedComponent.update(() => null as any);
    if (event) {
      this.isClose.update(() => false);
    }
    this.modalService.onCloseModalSubject.next(true);
    this.inputs.update(() => ({}));
    this.videoPlayerService.resetVideoPlayerStatus()
  }

  private listenConfirmationModal() {
    this.confirmationModalService.modalConfig$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((config) => {
        this.isEnableConfirmation.update(() => config.isOpen ?? false);
      });
  }

  toggleModal(event: boolean): void {
    this.isOpen.set(event);
  }
  saveChanges(event: boolean): void {
    this.isOpen.set(event);
  }

  onClickPriceList() {
    this.isPricingSectionVisible = false;
  }
  onClickStat(){
    this.isPricingSectionVisible = true;
    this.purchase="You haven’t purchased yet."
  }

  onRadioChange(index: number): void {
    this.selectedIndex = index;
  }

  switchLanguage(lang: string): void {
    this.translocoService.setActiveLang(lang);
  }
}

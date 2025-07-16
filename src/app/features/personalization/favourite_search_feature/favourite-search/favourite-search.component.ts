import { Component, HostListener, OnInit, inject } from '@angular/core';
import {
  TranslocoService,
  TranslocoDirective,
  provideTranslocoScope,
} from '@jsverse/transloco';
import { FavouriteSearchService } from '../services/favourite-search.service';
import {
  ApiResponse,
  ApiWrapper,
  DeletePayload,
  FavouriteSearchResponse,
  QueryPayload,
  SubscribePayload,
} from '../models/favourite_search';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { CookieService } from '../../../../core/services/cookie/cookie.service';


@Component({
  selector: 'app-favourite-search',
  standalone: true,
  imports: [TranslocoDirective, CommonModule],
  templateUrl: './favourite-search.component.html',
  styleUrls: ['./favourite-search.component.scss'],
  providers: [provideTranslocoScope('favourite')],
  animations: [
    // existing modalAnimation here…,
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ transform: 'translateY(100%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class FavouriteSearchComponent implements OnInit {
  private translocoService = inject(TranslocoService);
  private favService = inject(FavouriteSearchService);
  cookieService = inject(CookieService);
  rawCookie = this.cookieService.getCookie("MybdjobsGId") ?? '';
  userGuid = decodeURIComponent(this.rawCookie);

  currentLang = this.translocoService.getActiveLang();
  total = 0;
  favorites: FavouriteSearchResponse[] = [];

  //subscribe modal variable
  isModalOpen = false;
  modalSearchName = '';
  //delete modal variable
  isDeleteModalOpen = false;
  showUnsubscribeToast = false;
  toastMessage = '';
  private toastTimeoutId = 0;
  selectedItemId?: number;

  ngOnInit(): void {
    this.translocoService.langChanges$.subscribe(
      (lang) => (this.currentLang = lang)
    );

    const params: QueryPayload = {
      GuidId: this.userGuid || "",
      intCurPage: 1,
      intNoOfRecordPerPage: 10,
      strLastDate: '',
    };

    this.favService.getFavourites(params).subscribe((response: ApiWrapper<FavouriteSearchResponse>) => {
      const api= response.event;
      const msgData = api.eventData.find((ed) => ed.key === 'message');     
      if (msgData) {        
        this.favorites = msgData.value;
        this.total = this.favorites.length;
        const requests = this.favorites.map((fav) =>
          this.favService.getAvailableJobs(this.userGuid || "", fav.sfID)
        );    
        forkJoin(requests).subscribe((results) => {
          results.forEach((res, idx) => {
            this.favorites[idx].availableJobs = res.availableJobs;       
          });
        });
      }
    });
  }
  toggleSubscription(fav: FavouriteSearchResponse) {
    const currentStatus = this.isSubscribed(fav);
    const payload: SubscribePayload = {
      UserGuid: this.userGuid || "",
      SFID: fav.sfID,
      SubscribeValue: currentStatus == 1 ? '0' : '1', // 1 for subscribe, 0 for unsubscribe
    };
    this.favService.updateSubcriptionValue(payload).subscribe({
      next: () => {
        fav.smsNotification = currentStatus == 1 ? 'False' : 'True';

        if (fav.smsNotification == 'True') {
          this.modalSearchName = fav.filterName;
          this.openModal();
        }
        if (fav.smsNotification == 'False') {
          this.showUnsubscribeToast = true;
          clearTimeout(this.toastTimeoutId);
          this.toastTimeoutId = window.setTimeout(() => {
            this.showUnsubscribeToast = false;
          }, 5000);
        }
      },

      error: (err) => {
        console.error('Subscription update failed:', err);
      },
    });
  }

  private isSubscribed(fav: FavouriteSearchResponse): number {
    if (fav.smsNotification == 'True') {
      return 1;
    } else {
      return 0;
    }
  }
  openDeleteModal(item: FavouriteSearchResponse) {
    this.selectedItemId = item.sfID;   
    this.isDeleteModalOpen = true;
  }
  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }
  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }
  confirmDelete() {
    if (this.selectedItemId) {
      const payload: DeletePayload = {
        UserGuid: this.userGuid|| "", 
        sfID: this.selectedItemId
      };

      this.favService.deleteFavourite(payload).subscribe({
        next: () => {
          this.favorites = this.favorites.filter(f => f.sfID !== this.selectedItemId);
          this.total = this.favorites.length;
          this.closeDeleteModal();
        },
        error: (err) => {
          this.closeDeleteModal();
        }
      });
    }
  }
  closeToast() {
    this.showUnsubscribeToast = false;
  }
  @HostListener('window:keyup.esc') onEsc() {
    this.closeModal();
    this.closeDeleteModal();
  }
}

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ImageCropperComponent,
  ImageCroppedEvent,
} from 'ngx-image-cropper';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { UploadPhoto } from './model/uploadphoto';
import { PhotoUploadService } from './services/uploadphoto.service';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CreateAccountService } from '../create-account/services/create-account.service';
import { CookieService } from '../../../core/services/cookie/cookie.service';

@Component({
  selector: 'app-upload-photo',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent, RouterLink,TranslocoModule],
  providers: [provideTranslocoScope('photo')],
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.scss'],
})
export class UploadPhotoComponent {
  private createAccountService = inject(CreateAccountService);
  private route = inject(ActivatedRoute);
  selectedFile: File | null = null;
  filePreview = signal<string | null>(null);
  cropImage = signal<string | null>(null);
  showCropper = signal<boolean>(false);
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
  isSkipCropping = signal(false);
  imageChangedEvent: any = '';
  croppedImage: string | null = null;
  croppedFile: File | null = null;
  showCroppedImage = signal(false);
  originalFileName: string = '';
  cropData: {
    x: number;
    y: number;
    width: number;
    height: number;
    imageName: string;
  } | null = null;

  constructor(
    private router: Router,
    private photoUploadService: PhotoUploadService,
    private translocoService: TranslocoService,
    private cookieService: CookieService
  ) {}
  currentLanguage = 'en';
  isBlueCollar = false;
  isDisability = false;
  guid: string = "";

  ngOnInit() {
    this.guid = decodeURIComponent(this.cookieService.getCookie('MybdjobsGId') as string);

    this.route.queryParamMap.subscribe(params => {
      const type = params.get('type');
      this.isBlueCollar = type === 'b';
      this.isDisability = type === 'd';
      if (this.isBlueCollar || this.isDisability) {
        this.currentLanguage = 'bn';
        this.translocoService.setActiveLang('bn');
      }
     // Store account type in service
      this.createAccountService.setAccountType(type || 'w');
    });
  }

  fileChangeEvent(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;

      if (!this.allowedFormats.includes(file.type)) {
        this.errorMessage.set('The image file must be gif, jpeg or png.');
        return;
      }

      this.originalFileName = file.name;

      // Get original image dimensions
      const img = new Image();
      img.onload = () => {
        this.cropData = {
          x: 0,
          y: 0,
          width: img.width,
          height: img.height,
          imageName: file.name,
        };
      };
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      this.filePreview.set(objectUrl);

      this.errorMessage.set(null);
      this.isSkipCropping.set(false);
      this.imageChangedEvent = event;

      setTimeout(() => {
        input.value = '';
      }, 10);
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.objectUrl as string;

    if (event.blob) {
      this.croppedFile = new File(
        [event.blob],
        this.selectedFile?.name || 'cropped.jpg',
        {
          type: event.blob.type || 'image/jpeg',
        }
      );
    }

    this.cropData = {
      x: event.cropperPosition?.x1 || 0,
      y: event.cropperPosition?.y1 || 0,
      width: event.width || 0,
      height: event.height || 0,
      imageName: this.selectedFile?.name || '',
    };
    return event.objectUrl;
  }

  isCropped = signal<boolean>(false);
  showCroppedPhoto() {
    this.isCropped.set(true);
  }

  resetState() {
    this.filePreview.set(null);
    this.imageChangedEvent = null;
    this.isSkipCropping.set(false);
    this.cropData = null;
    this.selectedFile = null;
    this.croppedFile = null;
  }

  loadImageFailed() {
    this.errorMessage.set('❌ Failed to load image. Please try another file.');
  }

  uploadPhoto() {
    // Build the payload based on whether cropping is skipped or not.
    const payload: UploadPhoto = {
      imageFile: this.isSkipCropping() ? this.selectedFile : this.croppedFile,
      deviceType: 'web',
      Url: null,
      isFromBlueCollare: false,
      imageWidth: this.cropData?.width ?? 0,
      imageHeight: this.cropData?.height ?? 0,
      imageXAxis: this.cropData?.x ?? 0,
      imageYAxis: this.cropData?.y ?? 0,
      version: null,
      UserGuidId:this.guid,
    };


    this.photoUploadService.uploadImage(payload).subscribe({
      next: (res: any) => {
        this.router.navigate(['create-account/welcome']);
      },
      error: (err: any) => {
        console.error('Upload failed', err);
        this.errorMessage.set('Upload failed. Please try again.');
      },
    });
  }
}

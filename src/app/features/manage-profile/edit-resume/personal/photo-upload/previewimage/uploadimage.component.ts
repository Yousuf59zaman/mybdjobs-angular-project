import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CookieService } from '../../../../../../core/services/cookie/cookie.service';
import { PhotoUploadService } from '../service/photo-upload.service';
import {PhotoUploadModel} from '../model/photo-upload.model';


@Component({
  selector: 'app-uploadimage',
  imports: [FormsModule, CommonModule],
  templateUrl: './uploadimage.component.html',
  styleUrl: './uploadimage.component.scss'
})
export class UploadimageComponent implements AfterViewInit {
  @ViewChild('imageSource') imageSource!: ElementRef<HTMLImageElement>;
  @ViewChild('cropBox') cropBox!: ElementRef<HTMLDivElement>;
  @ViewChild('previewCanvas') previewCanvas!: ElementRef<HTMLCanvasElement>;

  allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
  selectedFile: File | null = null;
  filePreview: string | null = null;
  cropData: { x: number; y: number; width: number; height: number; imageName: string } | null = null;
  croppedFile: File | null = null;
  uploading = false;
  uploadError: string | null = null;
  imageLoaded = false;
  imageDataUrl: string | null = null;
  userGuidId: string | null = null;
  zoomValue = 50;
  cropSize = 150;
  cropPosition = { x: 100, y: 70 };
  isDragging = false;
  dragStartPos = { x: 0, y: 0 };

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private photoUploadService: PhotoUploadService
  ) {
    // Get image data and file from router state
    this.imageDataUrl = history.state.imageData || null;

    // Reconstruct File from base64 if present
    if (history.state.fileBase64 && history.state.fileName && history.state.fileType) {
      this.selectedFile = this.base64ToFile(history.state.fileBase64, history.state.fileName, history.state.fileType);
    }
    if (!this.imageDataUrl) {
      this.router.navigate(['/upload']);  //change router -fhm
    }
  }

  base64ToFile(base64: string, fileName: string, fileType: string): File {
    const arr = base64.split(',');
    const match = arr[0].match(/:(.*?);/);
    const mime = (match && match[1]) ? match[1] : fileType;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }

  ngOnInit(): void {
    // const rawGuid = this.cookieService.getCookie('MybdjobsGId'); //uncomment this line for production
    const rawGuid = this.cookieService.getCookie('MybdjobsGId'); // for development only
    this.userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;
    // Initialization logic can go here

    // If cropData is not set from file selection, try to get from router state
    if (!this.cropData && history.state.imageWidth && history.state.imageHeight) {
      this.cropData = {
        x: 0,
        y: 0,
        width: history.state.imageWidth,
        height: history.state.imageHeight,
        imageName: history.state.fileName || ''
      };
    }
  }

  ngAfterViewInit() {
    if (this.imageSource && this.imageDataUrl) {
      this.imageSource.nativeElement.src = this.imageDataUrl;
      this.imageSource.nativeElement.onload = () => {
        this.imageLoaded = true;
        this.updatePreview();
      };
    }
    const canvas = this.previewCanvas.nativeElement;
    canvas.width = 200;
    canvas.height = 200;
  }

  zoomOut() {
    this.zoomValue = Math.max(this.zoomValue - 10, 0);
    this.onZoomChange();
  }

  zoomIn() {
    this.zoomValue = Math.min(this.zoomValue + 10, 100);
    this.onZoomChange();
  }

  onZoomChange() {
    // const scale = 0.5 + (this.zoomValue / 100) * 0.5; // Scale from 0.5 to 1.0
    // this.cropSize = Math.max(100, Math.min(200, 250 * scale));
    // this.updatePreview();
    this.cropSize = 200 - (this.zoomValue / 100) * 100;
    this.cropSize = Math.max(100, Math.min(200, this.cropSize));
    // Update cropData with new size
    if (this.cropData) {
      this.cropData.width = this.cropSize;
      this.cropData.height = this.cropSize;
    }
    this.updatePreview();
  }

  getSliderTrackColor(value: number): string {
    return `linear-gradient(to right, #db2777 ${value}%, #e5e7eb ${value}%)`;
  }

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.dragStartPos = {
      x: event.clientX - this.cropPosition.x,
      y: event.clientY - this.cropPosition.y
    };

    // Ensure cropData is initialized with current crop box position and size
    if (this.cropData) {
      this.cropData.x = this.cropPosition.x;
      this.cropData.y = this.cropPosition.y;
      this.cropData.width = this.cropSize;
      this.cropData.height = this.cropSize;
    } else {
      this.cropData = {
        x: this.cropPosition.x,
        y: this.cropPosition.y,
        width: this.cropSize,
        height: this.cropSize,
        imageName: this.selectedFile?.name || ''
      };
    }

    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.stopDrag);
    event.preventDefault();
  }

  onDrag = (event: MouseEvent) => {
    if (!this.isDragging) return;

    const imgElement = this.imageSource.nativeElement;
    const imgRect = imgElement.getBoundingClientRect();

    // Calculate new position with boundaries
    const newX = event.clientX - this.dragStartPos.x;
    const newY = event.clientY - this.dragStartPos.y;

    // Ensure crop box stays within image bounds
    this.cropPosition.x = Math.max(imgRect.left - imgRect.left,
      Math.min(newX, imgRect.width - this.cropSize + imgRect.left - imgRect.left));
    this.cropPosition.y = Math.max(imgRect.top - imgRect.top,
      Math.min(newY, imgRect.height - this.cropSize + imgRect.top - imgRect.top));

    // Update cropData with new position and size
    if (this.cropData) {
      this.cropData.x = this.cropPosition.x;
      this.cropData.y = this.cropPosition.y;
      this.cropData.width = this.cropSize;
      this.cropData.height = this.cropSize;
    }

    this.updatePreview();
  }

  stopDrag = () => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDrag);
  }

  updatePreview() {
    if (!this.imageLoaded) return;

    const canvas = this.previewCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = this.imageSource.nativeElement;
    const imgRect = img.getBoundingClientRect();

    // Calculate the actual image dimensions (accounting for object-fit: contain)
    const imgNaturalRatio = img.naturalWidth / img.naturalHeight;
    const imgDisplayRatio = imgRect.width / imgRect.height;

    let imgDisplayWidth, imgDisplayHeight, imgOffsetX, imgOffsetY;

    if (imgDisplayRatio > imgNaturalRatio) {
      // Image is constrained by height
      imgDisplayHeight = imgRect.height;
      imgDisplayWidth = imgDisplayHeight * imgNaturalRatio;
      imgOffsetX = (imgRect.width - imgDisplayWidth) / 2;
      imgOffsetY = 0;
    } else {
      // Image is constrained by width
      imgDisplayWidth = imgRect.width;
      imgDisplayHeight = imgDisplayWidth / imgNaturalRatio;
      imgOffsetX = 0;
      imgOffsetY = (imgRect.height - imgDisplayHeight) / 2;
    }

    // Calculate source crop coordinates (relative to the actual image)
    const sourceX = (this.cropPosition.x - imgOffsetX) / imgDisplayWidth * img.naturalWidth;
    const sourceY = (this.cropPosition.y - imgOffsetY) / imgDisplayHeight * img.naturalHeight;
    const sourceSize = this.cropSize / imgDisplayWidth * img.naturalWidth;

    // Clear canvas and draw circular preview
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Draw the cropped image
    ctx.drawImage(
      img,
      sourceX, sourceY, sourceSize, sourceSize, // source rectangle
      0, 0, canvas.width, canvas.height // destination rectangle
    );
  }

  saveCroppedImage() {

    if (!this.selectedFile || !this.userGuidId) {
      this.uploadError = 'Image or user ID missing.';
      console.error('Image or user ID missing.');
      return;
    }
    this.uploading = true;
    this.uploadError = null;
    const canvas = this.previewCanvas.nativeElement;
    const fileType = this.selectedFile.type || 'image/png';
    canvas.toBlob((blob) => {
      if (!blob) {
        this.uploadError = 'Failed to crop image.';
        this.uploading = false;
        console.error('Failed to crop image.');
        return;
      }
      this.croppedFile = new File([blob], this.selectedFile?.name || 'cropped.jpg', { type: fileType });
      const model: PhotoUploadModel = {
        imageFile: this.croppedFile,
        imageWidth: this.cropData?.width ?? 0,
        imageHeight: this.cropData?.height ?? 0,
        imageXAxis: this.cropData?.x ?? 0,
        imageYAxis: this.cropData?.y ?? 0,
        guidId: this.userGuidId || ''
      };
      this.photoUploadService.uploadImage(model).subscribe({
        next: (res) => {
          this.uploading = false;
          // Check for eventType 2 (error event)
          if (Array.isArray(res) && res.length > 0 && res[0].eventType === 2) {
            const event = res[0];
            const msgObj = event.eventData?.find((d: any) => d.key === 'message');
            this.uploadError = msgObj ? msgObj.value : 'Upload failed. Please try again.';
            return;
          }
          // Success event
          this.uploadError = null;
          // Optionally show success message or navigate
          // Example: this.router.navigate(['/view-resume']);
          // Or show a toast/snackbar
        },
        error: (err) => {
          this.uploading = false;
          this.uploadError = 'Upload failed. Please try again.';
          console.error('Upload failed:', err);
        }
      });
    }, fileType);
  }

  onChangePhoto() {
    this.router.navigate(['/upload']);
  }
}

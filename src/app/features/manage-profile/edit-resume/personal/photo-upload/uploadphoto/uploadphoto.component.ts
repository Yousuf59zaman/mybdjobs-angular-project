import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-uploadphoto',
  imports: [CommonModule],
  templateUrl: './uploadphoto.component.html',
  styleUrl: './uploadphoto.component.scss'
})
export class UploadPhotosComponent {
  allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
  selectedFile: File | null = null;
  errorMessage: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialization logic can go here
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
      // Validation: type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.errorMessage = 'The image file must be JPG or PNG.';
        return;
      }
      // Validation: size (5MB = 5 * 1024 * 1024)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'The image file must be less than 5MB.';
        return;
      }
      this.errorMessage = null;
      // Get original image dimensions
      const img = new Image();
      img.onload = () => {
        this.router.navigate(['/preview'], {
          state: {
            imageData: reader.result,
            fileName: file.name,
            fileType: file.type,
            imageWidth: img.width,
            imageHeight: img.height,
            fileBase64: (reader.result as string)
          }
        });
      };
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}

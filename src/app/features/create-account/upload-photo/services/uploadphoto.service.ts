// src/app/services/photo-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UploadPhoto } from '../model/uploadphoto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoUploadService {
  // Replace with your actual endpoint URL
  private apiUrl = 'https://accountsubsystem-52061700766.asia-southeast1.run.app/api/CreateAccount/UploadImage';

  constructor(private http: HttpClient) {}

  uploadImage(payload: UploadPhoto): Observable<any> {
    const formData = new FormData();

    if (payload.imageFile) {
      formData.append('imageFile', payload.imageFile);
    }

    formData.append('deviceType', payload.deviceType);
    formData.append('Url', payload.Url ?? '');
    formData.append('isFromBlueCollare', (payload.isFromBlueCollare ?? false).toString());
    formData.append('imageWidth', (payload.imageWidth ?? 0).toString());
    formData.append('imageHeight', (payload.imageHeight ?? 0).toString());
    formData.append('imageXAxis', (payload.imageXAxis ?? 0).toString());
    formData.append('imageYAxis', (payload.imageYAxis ?? 0).toString());
    formData.append('version', payload.version ?? '');
    formData.append('UserGuidId', payload.UserGuidId ?? '');
    return this.http.post(this.apiUrl, formData);
  }

}

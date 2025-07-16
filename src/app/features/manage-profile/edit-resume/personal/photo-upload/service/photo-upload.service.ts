import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PhotoUploadModel } from '../model/photo-upload.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoUploadService {
  private apiUrl = 'https://accountsubsystem-52061700766.asia-southeast1.run.app/api/CreateAccount/UploadImage';

  constructor(private http: HttpClient) {}

  uploadImage(payload: PhotoUploadModel): Observable<any> {
    const formData = new FormData();
    if (payload.imageFile) {
      formData.append('imageFile', payload.imageFile);
    }
    formData.append('deviceType', 'web');
    formData.append('Url', '');
    formData.append('isFromBlueCollare', 'false');
    formData.append('imageWidth', (payload.imageWidth ?? 0).toString());
    formData.append('imageHeight', (payload.imageHeight ?? 0).toString());
    formData.append('imageXAxis', (payload.imageXAxis ?? 0).toString());
    formData.append('imageYAxis', (payload.imageYAxis ?? 0).toString());
    formData.append('version', '');
    formData.append('guidId', payload.guidId ?? '');
    return this.http.post(this.apiUrl, formData);
  }
}

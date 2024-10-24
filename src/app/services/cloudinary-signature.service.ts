import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private readonly cloudName = 'milla2000';
  private readonly uploadPreset = 'new_preset';

  constructor(private readonly http: HttpClient) {}

  getSignature(): Observable<any> {
    return this.http.get('https://localhost:7269/api/Cloudinary/signature');
  }

  uploadImage(file: File, signatureData: any): Observable<any> {
    console.log('File:', file, 'Signature data:', signatureData);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', signatureData.timestamp);
    formData.append('api_key', signatureData.apiKey);
    formData.append('signature', signatureData.signature);
    formData.append('upload_preset', this.uploadPreset);

    console.log('Form data:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    return this.http.post(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`,
      formData
    );
  }
}

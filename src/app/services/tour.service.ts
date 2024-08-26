import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAddTourDto, ITourImageDto } from '../models/tour.model'; // Adjust the path as needed

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private apiUrl = 'https://localhost:7032/api/Tour'; // Your API URL
  private cloudinaryUploadUrl =
    'https://api.cloudinary.com/v1_1/milla2000/upload'; // Replace with your Cloudinary upload URL

  constructor(private http: HttpClient) {}

  getAllTours(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Method to upload the image to Cloudinary
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'milla2000'); // Replace with your Cloudinary upload preset

    return this.http
      .post<{ secure_url: string }>(this.cloudinaryUploadUrl, formData)
      .pipe(
        map((response) => response.secure_url) // Extract the image URL from the response
      );
  }

  addTour(tourData: IAddTourDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, tourData);
  }
}

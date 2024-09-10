import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAddTourDto, ITourImageDto } from '../models/tour.model'; // Adjust the path as needed


@Injectable({
  providedIn: 'root',
})
export class TourService {
  private apiUrl = 'http://localhost:5079/api/Tour';

  constructor(private http: HttpClient) {}

  getAllTours(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/getAllTours');
  }

  addTour(tourData: IAddTourDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + '/AddNewTour'}`, tourData);
  }

  getTourById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl + '/getATour'}/${id}`);
  }

  addImages(tourId: string, imageUrls: string[]): Observable<any> {
    const payload = imageUrls.map((imageUrl) => ({ image: imageUrl })); // Convert image URLs to AddTourImageDto
    return this.http.post(
      `http://localhost:5079/api/Images/${tourId}`,
      payload
    );
  }
}

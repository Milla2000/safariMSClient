import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAddTourDto} from '../models/tour.model'; 


@Injectable({
  providedIn: 'root',
})
export class TourService {
  private readonly apiUrl = 'https://localhost:7032/api/Tour';

  constructor(private readonly http: HttpClient) {}

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
    // Convert image URLs to AddTourImageDto
    const payload = imageUrls.map((imageUrl) => ({ image: imageUrl }));
    return this.http.post(
      `https://localhost:7032/api/Images/${tourId}`,
      payload
    );
  }
}

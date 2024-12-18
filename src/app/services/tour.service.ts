import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAddTourDto, IToursandImagesResponseDto } from '../models/tour.model';
import { IResponseDto, ResultDto } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private readonly apiUrl = 'https://localhost:7032/api/Tour';

  constructor(private readonly http: HttpClient) {}

  getAllTours(): Observable<IResponseDto<IToursandImagesResponseDto[]>> {
    return this.http.get<IResponseDto<IToursandImagesResponseDto[]>>(
      this.apiUrl + '/getAllTours'
    );
  }

  addTour(tourData: IAddTourDto): Observable<IResponseDto<IToursandImagesResponseDto[]>> {
    return this.http.post<any>(`${this.apiUrl + '/AddNewTour'}`, tourData);
  }

  getTourById(id: string): Observable<IResponseDto<IToursandImagesResponseDto>> {
    return this.http.get<any>(`${this.apiUrl + '/getATour'}/${id}`);
  }

  addImages(tourId: string, imageUrls: string[]): Observable<IResponseDto<ResultDto>> {
    // Convert image URLs to AddTourImageDto
    const payload = imageUrls.map((imageUrl) => ({ image: imageUrl }));

    return this.http.post<IResponseDto<ResultDto>>(
      `https://localhost:7032/api/Images/${tourId}`,
      payload
    );
  }
}

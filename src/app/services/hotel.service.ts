import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAddHotelDto, IHotelResponseDto } from '../models/hotel.model'; 
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private apiUrl = 'http://localhost:5079/api/Hotels'; // Adjust the base URL as needed

  constructor(private http: HttpClient) {}

  // Add a new hotel
  addHotel(hotelData: IAddHotelDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, hotelData);
  }

  // Get hotels by tour ID
  getHotelsByTourId(tourId: string): Observable<IHotelResponseDto[]> {
    return this.http
      .get<any>(`${this.apiUrl}/${tourId}`)
      .pipe(map((response) => response.result as IHotelResponseDto[]));
  }

  // Get a single hotel by its ID
  getHotelById(id: string): Observable<IHotelResponseDto> {
    return this.http
      .get<any>(`${this.apiUrl}/single/${id}`)
      .pipe(map((response) => response.result as IHotelResponseDto));
  }
}

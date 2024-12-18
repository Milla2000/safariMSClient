import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAddHotelDto, IHotel} from '../models/hotel.model'; 
import { IResponseDto } from '../models/user.model';


@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private readonly apiUrl = 'https://localhost:7000/api/Hotels';
  constructor(private readonly http: HttpClient) {}

  // Add a new hotel
  addHotel(hotelData: IAddHotelDto): Observable<IResponseDto<IHotel[]>> {
    return this.http.post<IResponseDto<IHotel[]>>(`${this.apiUrl}`, hotelData);
  }

  // Get hotels by tour ID
  getHotelsByTourId(tourId: string): Observable<IResponseDto<IHotel[]>> {
    return this.http.get<IResponseDto<IHotel[]>>(`${this.apiUrl}/${tourId}`);
  }

  // Get a single hotel by its ID
  getHotelById(id: string): Observable<IResponseDto<IHotel[]>> {
    return this.http.get<IResponseDto<IHotel[]>>(`${this.apiUrl}/single/${id}`);
  }
}

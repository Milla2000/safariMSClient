import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // To capture the hotel Id from the URL or route params
import { HotelService } from '../services/hotel.service';
import { firstValueFrom } from 'rxjs';
import { IHotel } from '../models/hotel.model';
import { IResponseDto } from '../models/user.model';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrls: ['./hotel-card.component.css'],
})
export class HotelCardComponent implements OnInit {
  hotel: IResponseDto<IHotel[]> | null = null; // array of hotels
  hotelId: string | null = null; // Hotel Id captured from route
  constructor(
    private readonly hotelService: HotelService,
    private readonly route: ActivatedRoute,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('id'); // Capture the hotel Id from the route parameter
    if (this.hotelId) {
      this.getHotel(this.hotelId);
    }
  }

  async getHotel(id: string): Promise<void> {
    try {
      const hotelData= await firstValueFrom(this.hotelService.getHotelById(id));
      const hotelWithRating = hotelData.result.map((hotel) => ({
        ...hotel,
        rating: 4.5,
        reviews: 120,
      }));
      this.hotel = {
        errormessage: hotelData.errormessage,
        result: hotelWithRating,
        isSuccess: hotelData.isSuccess,
      };
    } catch (error) {
      this.toastService.showToast('Error fetching hotel');
    }
  }
}

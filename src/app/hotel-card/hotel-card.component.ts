import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // To capture the hotel Id from the URL or route params
import { HotelService } from '../services/hotel.service';
import { firstValueFrom } from 'rxjs';
import { IHotelResponseDto } from '../models/hotel.model';

@Component({
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrls: ['./hotel-card.component.css'],
})
export class HotelCardComponent implements OnInit {
  hotel: IHotelResponseDto | null = null; // Single hotel data
  hotelId: string | null = null; // Hotel Id captured from route
  constructor(
    private readonly hotelService: HotelService,
    private readonly route: ActivatedRoute // For getting hotel Id from the route
  ) {}

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('id'); // Capture the hotel Id from the route parameter
    if (this.hotelId) {
      this.getHotel(this.hotelId);
    }
  }

  async getHotel(id: string): Promise<void> {
    try {
      const data = await firstValueFrom(this.hotelService.getHotelById(id));
      this.hotel = {
        rating: 4.5,
        reviews: 120,
        errormessage: data.errormessage,
        result: data.result,
        isSuccess: data.isSuccess,
      };
      console.log('Hotel:', this.hotel);
    } catch (error) {
      console.error('Error fetching hotel:', error);
    }
  }
}

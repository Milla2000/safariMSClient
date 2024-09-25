import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BookingService } from '../services/booking.service';
import { HotelService } from '../services/hotel.service';
import { IBookingDto } from '../models/booking.model';
import { IHotel } from '../models/hotel.model';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.css'],
})
export class BookingCardComponent implements OnInit {
  userId = localStorage.getItem('userId'); // Retrieve user ID
  tourId: string | null = null; // Store tour ID from route
  hotels: IHotel[] = []; // Store hotels from API
  selectedHotelId: string | null = null; // Store selected hotel ID
  adults: number = 0; // Number of adults
  kids: number = 0; // Number of kids
  bookingTotal: number = 0; // Total booking amount
  bookingId: string | null = null; // Store booking ID after submission

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.initializeTourId();
  }

  private initializeTourId(): void {
    this.route.paramMap.subscribe((params) => {
      this.tourId = params.get('id');
      if (this.tourId) {
        this.fetchHotels();
      }
    });
  }

  private async fetchHotels(): Promise<void> {
    if (!this.tourId) return;

    try {
      const response = await firstValueFrom(
        this.hotelService.getHotelsByTourId(this.tourId)
      );
      if (response.isSuccess) {
        this.hotels = response.result;
      } else {
        console.error('Error fetching hotels:', response.errormessage);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  }

  async submitBooking(): Promise<void> {
    if (!this.selectedHotelId) {
      console.error('No hotel selected');
      return;
    }

    const bookingData: IBookingDto = {
      userId: this.userId!,
      adults: this.adults,
      kids: this.kids,
      tourId: this.tourId!,
      hotelId: this.selectedHotelId!,
      bookingTotal: 0, 
    };

    try {
      const response = await firstValueFrom(
        this.bookingService.addBooking(bookingData)
      );
      this.handleBookingSuccess(response);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  }

  private handleBookingSuccess(response: any): void {
    this.bookingTotal = response.result.bookingTotalPrice;
    this.bookingId = response.result.bookingId;
    console.log('Booking successful:', response);
  }
}

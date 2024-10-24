import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBookingDto } from '../models/booking.model';
import { IStripeRequestDto } from '../models/stripe.model';
import { IResponseDto } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly apiUrl = 'https://localhost:7074/api/Booking'; 

  constructor(private readonly http: HttpClient) {}

  // Add a new booking
  addBooking(bookingData: IBookingDto): Observable<IResponseDto> {
    return this.http.post<any>(`${this.apiUrl}`, bookingData);
  }

  // Make a payment using Stripe
  makePayment(paymentData: IStripeRequestDto): Observable<IResponseDto> {
    return this.http.post<any>(`${this.apiUrl}/Pay`, paymentData);
  }

  // Validate a payment by its ID
  validatePayment(paymentId: string): Observable<IResponseDto> {
    return this.http.post<any>(`${this.apiUrl}/validate/${paymentId}`, {});
  }

  // Get all bookings for a specific user
  getUserBookings(userId: string): Observable<IResponseDto> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  // Apply a coupon to a booking by its ID
  applyCoupon(bookingId: string, couponCode: string): Observable<IResponseDto> {
    return this.http.put<any>(`${this.apiUrl}/${bookingId}`, null, {
      params: { Code: couponCode },
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBookingDto } from '../models/booking.model';
import { IStripeRequestDto } from '../models/stripe.model';
import { IResponseDto, ResultDto } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly apiUrl = 'https://localhost:7074/api/Booking';

  constructor(private readonly http: HttpClient) {}

  // Add a new booking
  addBooking(bookingData: IBookingDto): Observable<IResponseDto<ResultDto>> {
    return this.http.post<any>(`${this.apiUrl}`, bookingData);
  }

  // Make a payment using Stripe
  makePayment(
    paymentData: IStripeRequestDto
  ): Observable<IResponseDto<IStripeRequestDto>> {
    return this.http.post<any>(`${this.apiUrl}/Pay`, paymentData);
  }

  // Validate a payment by its ID
  validatePayment(paymentId: string): Observable<IResponseDto<ResultDto>> {
    return this.http.post<any>(`${this.apiUrl}/validate/${paymentId}`, {});
  }

  // Get all bookings for a specific user
  getUserBookings(userId: string): Observable<IResponseDto<ResultDto>> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  // Apply a coupon to a booking by its ID
  applyCoupon(bookingId: string, couponCode: string): Observable<IResponseDto<ResultDto>> {
    // Construct query parameters
    const params = new HttpParams()
      .set('Id', bookingId)
      .set('Code', couponCode);
    return this.http.put<IResponseDto<ResultDto>>(`${this.apiUrl}/applycoupon`, null, {
      params,
    });
  }
}

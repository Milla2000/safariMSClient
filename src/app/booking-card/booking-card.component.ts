import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BookingService } from '../services/booking.service';
import { HotelService } from '../services/hotel.service';
import { IBookingDto } from '../models/booking.model';
import { IHotel } from '../models/hotel.model';
import { IStripeRequestDto } from '../models/stripe.model';
import { AddCouponDto } from '../models/coupon.model';
import { IResponseDto, ResultDto } from '../models/user.model';
import { CouponService } from '../services/coupon.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.css'],
})
export class BookingCardComponent implements OnInit {
  userId!: string;
  tourId: string | null = null;
  hotels: IHotel[] = [];
  selectedHotelId: string | null = null;
  adults: number = 0;
  kids: number = 0;
  bookingTotal: number = 0;
  bookingId: string | null = null;
  bestCouponCode: string | null = null;
  selectedCouponCode: string | null = null;
  errorMessage: string = '';
  coupons: AddCouponDto[] = [];
  couponApplied = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bookingService: BookingService,
    private readonly hotelService: HotelService,
    private readonly router: Router,
    private readonly couponService: CouponService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getCoupons();

    this.initializeTourId();
    // Retrieve user JSON string from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.userId = user.id;
      console.log('User ID:', this.userId);
    } else {
      this.toastService.showToast('Kindly login to place a booking');

      // Redirect to login page and pass the current URL to return after login
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }
    this.route.queryParams.subscribe((params) => {
      const bookingId = params['bookingId'];
      if (bookingId) {
        this.bookingId = bookingId;
        this.makePayment();
      }
    });
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
        console.log('Hotels:', this.hotels);
      } else {
        this.toastService.showToast(
          `Error fetching hotels ${response.errormessage}`
        );
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.toastService.showToast(
          `An error occurred fetching hotels ${error.message}`
        );
      } else {
        this.toastService.showToast(
          'An unexpected error occurred whil fetching hotels'
        );
      }
    }
  }

  async submitBooking(): Promise<void> {
    if (!this.selectedHotelId) {
      this.toastService.showToast(
        'Please select a hotel first before submitting a booking'
      );
      return;
    }

    const bookingData: IBookingDto = {
      userId: this.userId,
      adults: this.adults,
      kids: this.kids,
      tourId: this.tourId!,
      hotelId: this.selectedHotelId,
      bookingTotal: 0,
    };

    try {
      const response = await firstValueFrom(
        this.bookingService.addBooking(bookingData)
      );
      this.handleBookingSuccess(response);
    } catch (error) {
      this.toastService.showToast(
        'An error occurred while booking, kindly try again later'
      );
    }
  }

  private handleBookingSuccess(response: any): void {
    this.bookingTotal = response.result.bookingTotalPrice;
    this.bookingId = response.result.bookingId;
  }

  getCoupons(): void {
    this.couponService.getAllCoupons().subscribe({
      next: (response: IResponseDto<AddCouponDto[]>) => {
        if (response.isSuccess) {
          this.coupons = response.result || [];
        } else {
          this.errorMessage = response.errormessage;
          this.toastService.showToast(
            `Error fetching coupons: ${this.errorMessage}`
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
        this.toastService.showToast(
          `Error fetching coupons: ${this.errorMessage}`
        );
      },
    });
  }

  filterBestCouponForAmount(amount: number) {
    const validCoupons = this.coupons.filter(
      (coupon) => coupon.couponMinAmount <= amount
    ); // Filter by minAmount condition

    if (validCoupons.length === 0) {
      
      this.toastService.showToast("You don't qualify for any coupon.");
      return null;
    }

    const bestCoupon = validCoupons.reduce(
      (best, current) =>
        current.couponAmount > best.couponAmount ? current : best,
      validCoupons[0]
    );
    this.bestCouponCode = bestCoupon.couponCode;

    return this.bestCouponCode;
  }

  applyCoupon(): void {
    this.filterBestCouponForAmount(this.bookingTotal);
    if (!this.bestCouponCode || !this.bookingId) {
      this.toastService.showToast('No coupon to apply or booking ID is missing.');
      return;
    }

    this.bookingService
      .applyCoupon(this.bookingId, this.bestCouponCode)
      .subscribe({
        next: (response: IResponseDto<ResultDto>) => {
          if (response.isSuccess) {
            this.bookingTotal = response.result.total;
            this.toastService.showToast('Coupon applied successfully:');
            this.couponApplied = true;
            this.errorMessage = '';
          } else {
            this.errorMessage = response.errormessage;
            this.toastService.showToast(this.errorMessage);
          }
        },
        error: (response: HttpErrorResponse) => {
          this.errorMessage = response.error.errormessage || 'An error occurred';
          this.toastService.showToast(this.errorMessage);
        },
      });
  }

  // Add this method to handle payments
  async makePayment(): Promise<void> {
    if (!this.bookingId) {
      this.toastService.showToast('Booking ID is missing');
      return;
    }

    const paymentData: IStripeRequestDto = {
      bookingId: this.bookingId,
      approvedUrl: `http://localhost:4200/validatepayment/${this.bookingId}`,
      cancelUrl: 'https://your-frontend-app.com/payment-cancel',
      stripeSessionUrl: '',
      stripeSessionId: '',
    };

    try {
      const response = await firstValueFrom(
        this.bookingService.makePayment(paymentData)
      );

      if (response.isSuccess) {
        if (response.result.stripeSessionUrl) {
          window.location.href = response.result.stripeSessionUrl;
        } else {
          this.toastService.showToast(
            'stripeSessionUrl is missing in response:'
          );
          return;
        }
      } else {
        this.toastService.showToast(response.errormessage);
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.toastService.showToast(
          `Error making payment: ${error.error.message || 'An error occurred'}`
        );
      } else {
        this.toastService.showToast('An unexpected error occurred');
      }
    }
  }
}

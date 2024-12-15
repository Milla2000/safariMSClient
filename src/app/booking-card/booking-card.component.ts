import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BookingService } from '../services/booking.service';
import { HotelService } from '../services/hotel.service';
import { IBookingDto } from '../models/booking.model';
import { IHotel } from '../models/hotel.model';
import { IStripeRequestDto } from '../models/stripe.model';
import { AddCouponDto, ICouponResponseDto } from '../models/coupon.model';
import { CouponService } from '../services/coupon.service';

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
  showToast: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bookingService: BookingService,
    private readonly hotelService: HotelService,
    private readonly router: Router,
    private readonly couponService: CouponService
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
      alert('Kindly login to place a booking');
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
    console.log('my Tour ID:', this.tourId);
    try {
      const response = await firstValueFrom(
        this.hotelService.getHotelsByTourId(this.tourId)
      );
      if (response.isSuccess) {
        this.hotels = response.result;
        console.log('Hotels:', this.hotels);
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
      userId: this.userId,
      adults: this.adults,
      kids: this.kids,
      tourId: this.tourId!,
      hotelId: this.selectedHotelId!,
      bookingTotal: 0,
    };

    try {
      console.log('Booking data:', bookingData);
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

  getCoupons() {
    this.couponService.getAllCoupons().subscribe({
      next: (response: ICouponResponseDto) => {
        this.coupons = response.result || [];
        console.log('Coupons:', this.coupons);
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }

  filterBestCouponForAmount(amount: number) {
    // Find the best coupon whose min amount has been attained
    const validCoupons = this.coupons.filter(
      (coupon) => coupon.couponMinAmount <= amount
    ); // Filter by minAmount condition

    if (validCoupons.length === 0) {
      console.log('No valid coupon found for the specified amount.');
      this.showToastNotification("You don't qualify for any coupon.");
      return null;
    }

    const bestCoupon = validCoupons.reduce(
      (best, current) =>
        current.couponAmount > best.couponAmount ? current : best,
      validCoupons[0]
    );
    this.bestCouponCode = bestCoupon.couponCode;

    // console.log('Best coupon for the customer:', this.bestCouponCode);
    return this.bestCouponCode;
  }

  applyCoupon(): void {
    this.filterBestCouponForAmount(this.bookingTotal);
    if (!this.bestCouponCode || !this.bookingId) {
      this.errorMessage = 'No coupon to apply or booking ID is missing.';
      this.showToastNotification(
        'No coupon to apply or booking ID is missing.'
      );
      return;
    }
    console.log('Applying coupon:', this.bestCouponCode,  this.bookingId);
    this.bookingService
      .applyCoupon(this.bookingId, this.bestCouponCode)
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.bookingTotal = response.result.total;
            this.errorMessage = '';
          } else {
            this.errorMessage = response.errormessage;
            // console.log('Error applying coupon:', this.errorMessage);
            this.showToastNotification(this.errorMessage);
          }
        },
        error: (error) => {
          this.errorMessage = error;
          this.showToastNotification(this.errorMessage);
          console.log('Error applying coupon:', this.errorMessage);
        },
      });
  }

  // Add this method to handle payments
  async makePayment(): Promise<void> {
    if (!this.bookingId) {
      console.error('Booking ID is missing');
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
        // Access stripeSessionUrl from result, assuming it is there
        const result: any = response.result; // Cast result as 'any' to avoid TypeScript checking

        if (result.stripeSessionUrl) {
          window.location.href = result.stripeSessionUrl;
          console.log('Redirecting to Stripe:', response);
        } else {
          console.error('stripeSessionUrl is missing in response:', result);
        }
      } else {
        console.error('Payment failed:', response.errormessage);
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  }

  showToastNotification(message: string): void {
    this.errorMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}

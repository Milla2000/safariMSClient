import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service'; // Adjust the path as necessary
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-validate-payment',
  templateUrl: './validate-payment.component.html',
  styleUrls: ['./validate-payment.component.css'],
})
export class ValidatePaymentComponent implements OnInit {
  bookingId!: string; // Booking ID to validate payment
  isSuccess = false; // Flag to check payment validation success
  errorMessage: string | null = null; // Variable to store error message

  constructor(
    private readonly bookingService: BookingService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve bookingId from route parameters
    this.route.params.subscribe((params) => {
      this.bookingId = params['id'];
      this.validatePayment();
    });
  }

  async validatePayment(): Promise<void> {
    if (!this.bookingId) {
      console.error('Booking ID is missing');
      this.errorMessage = 'Booking ID is missing.';
      return;
    }

    try {
      this.bookingService.validatePayment(this.bookingId).subscribe(
        (response) => {
          if (response.isSuccess) {
            console.log('Payment validation successful:', response.result);
            this.isSuccess = true;
          } else {
            console.error('Payment validation failed:', response.errormessage);
            this.errorMessage =
              response.errormessage || 'Payment validation failed.';
          }
        },
        (error) => {
          console.error('Error during payment validation:', error);
          this.errorMessage = 'An error occurred during payment validation.';
        }
      );
    } catch (error) {
      console.error('Error during payment validation:', error);
      this.errorMessage = 'An error occurred during payment validation.';
    }
  }

  goToTours(): void {
    this.router.navigate(['/tour']); // Navigation after payment success
  }

  retryPayment(): void {
    this.router.navigate([`/bookingatour/${this.bookingId}`], {
      queryParams: { bookingId: this.bookingId },
    });
  }
}

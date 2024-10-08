import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service'; // Adjust the path as necessary
import { ActivatedRoute } from '@angular/router';

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
    private bookingService: BookingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Retrieve bookingId from route parameters
    this.route.params.subscribe((params) => {
      this.bookingId = params['id']; // Retrieve bookingId from the URL parameter
      this.validatePayment(); // Call validatePayment once bookingId is available
    });
  }

  async validatePayment(): Promise<void> {
    if (!this.bookingId) {
      console.error('Booking ID is missing');
      this.errorMessage = 'Booking ID is missing.';
      return;
    }

    try {
      const response = await this.bookingService.validatePayment(
        this.bookingId
      );
      if (response.isSuccess) {
        console.log('Payment validation successful:', response.result);
        this.isSuccess = true; 
      } else {
        console.error('Payment validation failed:', response.errorMessage);
        this.errorMessage =
          response.errorMessage || 'Payment validation failed.';
      }
    } catch (error) {
      console.error('Error during payment validation:', error);
      this.errorMessage = 'An error occurred during payment validation.';
    }
  }
}

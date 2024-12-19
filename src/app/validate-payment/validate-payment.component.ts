import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service'; // Adjust the path as necessary
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators'; // RxJS finalize operator
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-validate-payment',
  templateUrl: './validate-payment.component.html',
  styleUrls: ['./validate-payment.component.css'],
})
export class ValidatePaymentComponent implements OnInit {
  bookingId!: string; // Booking ID to validate payment
  isSuccess = false; // Flag to check payment validation success
  errorMessage: string | null = null; // Variable to store error message
  isLoading = true; // Set loading to true initially

  constructor(
    private readonly bookingService: BookingService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Retrieve bookingId from route parameters
    this.route.params.subscribe((params) => {
      this.bookingId = params['id'];
      this.validatePayment();
    });
  }

  validatePayment(): void {
    if (!this.bookingId) {
      this.handleFailure('Booking ID is missing.');
      return;
    }

    this.startLoading(); // Start the loading state

    this.bookingService
      .validatePayment(this.bookingId)
      .pipe(finalize(() => this.stopLoading())) // Ensures `isLoading` is false regardless of success or error
      .subscribe(
        (response) => {
          if (response.isSuccess) {
            this.handleSuccess(response.result);
          } else {
            this.handleFailure(
              response.errormessage || 'Payment validation failed.'
            );
          }
        },
        (error) =>
          this.handleFailure('An error occurred during payment validation.')
      );
  }

  private handleSuccess(result: any): void {
    this.isSuccess = true; 
    this.errorMessage = null; 
    console.log('Payment validation successful:', result);
    this.toastService.showToast(`Payment validation successful `);
  }

  private handleFailure(message: string): void {
    this.isSuccess = false; // Mark validation as failed
    this.errorMessage = message;
    this.toastService.showToast(`Payment validation failed: ${message}`);
  }

  private startLoading(): void {
    this.isLoading = true;
    this.isSuccess = false;
    this.errorMessage = null; 
  }

  private stopLoading(): void {
    this.isLoading = false; // Always stop loading at the end
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

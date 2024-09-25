export interface IStripeRequestDto {
  stripeSessionUrl: string;
  stripeSessionId: string;
  approvedUrl: string;
  canceledUrl: string;
  bookingId: string;
}

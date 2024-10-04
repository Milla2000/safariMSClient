export interface IStripeRequestDto {
  stripeSessionUrl: string;
  stripeSessionId: string;
  approvedUrl: string;
  cancelUrl: string;
  bookingId: string;
}

export interface IStripeResponseDto {
  stripeSessionId: string;
  stripeSessionUrl: string;
  approvedUrl: string;
  cancelUrl: string;
  bookingId: string;
}

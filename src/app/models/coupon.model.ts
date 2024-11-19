export interface AddCouponDto {
  couponCode: string;
  couponAmount: number;
  couponMinAmount: number;
}

export interface ICouponResponseDto {
  errormessage: string;
  result: {
    coupon: AddCouponDto;
  };
  isSuccess: boolean;
}

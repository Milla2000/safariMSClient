export interface AddCouponDto {
  couponCode: string;
  couponAmount: number;
  couponMinAmount: number;
  id: string;
}

export interface ICouponResponseDto {
  errormessage: string;
  result: AddCouponDto[];
  isSuccess: boolean;
}

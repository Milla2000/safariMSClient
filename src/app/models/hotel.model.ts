export interface IAddHotelDto {
  name: string;
  tourId: string;
  adultPrice: number;
  kidsPrice: number;
}

export interface IHotelResponseDto {
  name: string;
  adultPrice: number;
  kidsPrice: number;
}

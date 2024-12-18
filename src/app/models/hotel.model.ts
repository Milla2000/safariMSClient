export interface IAddHotelDto {
  name: string;
  tourId: string;
  adultPrice: number;
  kidsPrice: number;
}

export interface IHotel {
  id: string;
  name: string;
  tourId: string;
  adultPrice: number;
  kidsPrice: number;
  rating?: number;
  reviews?: number;
}

// export interface IHotelResponseDto {
//   errormessage: string;
//   result: IHotel[];
//   isSuccess: boolean;
//   rating?: number;
//   reviews?: number;
// }

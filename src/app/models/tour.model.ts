export interface ITourImageDto {
  image: string;
}

export interface IAddTourDto {
  safariName: string;
  safariDescription: string;
  startDate: Date;
  endDate: Date;
  price: number;
  safariImages?: ITourImageDto[]; 
}


export interface IToursandImagesResponseDto {
  id: string;
  safariName: string;
  safariDescription: string;
  startDate: Date;
  endDate: Date;
  price: number;
  tourImages: ITourImageDto[];
}
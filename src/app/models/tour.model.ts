export interface ITourImageDto {
  image: string;
}

export interface IAddTourDto {
  safariName: string;
  safariDescription: string;
  startDate: Date;
  endDate: Date;
  price: number;
  safariImages: string[];
}

export interface IToursandImagesResponseDto {
  id: string;
  safariName: string;
  safariDescription: string;
  startDate: Date;
  endDate: Date;
  price: number;
  tourImages?: ITourImageDto[];
}

export interface ITour {
  id: string;
  safariName: string;
  safariDescription: string;
  safariImages: ITourImageDto[];
  startDate: Date;
  endDate: Date;
  price: number;
}

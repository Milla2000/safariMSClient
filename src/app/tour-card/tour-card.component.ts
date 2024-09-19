import { Component, OnInit } from '@angular/core';
import { TourService } from '../services/tour.service';
import { IToursandImagesResponseDto, IAddTourDto } from '../models/tour.model';
import { firstValueFrom } from 'rxjs';
import { CloudinaryService } from '../services/cloudinary-signature.service';

@Component({
  selector: 'app-tour',
  templateUrl: './tour-card.component.html',
  styleUrls: ['./tour-card.component.css'],
})
export class TourComponent implements OnInit {
  tours: IToursandImagesResponseDto[] = [];
  showForm: boolean = false;
  newTour: IAddTourDto = {
    safariName: '',
    safariDescription: '',
    startDate: new Date(),
    endDate: new Date(),
    price: 0,
    safariImages: [],
  };
  selectedFiles: File[] = []; // Holds the selected files
  minDate!: string;
  priceError: boolean = false;
  isStartDateSelected: boolean = false;

  constructor(
    private tourService: TourService,
    private cloudinaryService: CloudinaryService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    // Format the date to 'YYYY-MM-DD' format required by the date input
    this.minDate = today.toISOString().split('T')[0];
    this.getTours();
  }

  private isDateRangeValid(startDate: Date, endDate: Date): boolean {
      return startDate <= endDate;
  }

  async getTours(): Promise<void> {
    try {
      const data = await firstValueFrom(this.tourService.getAllTours());
      this.tours = data.result.map((tour: IToursandImagesResponseDto) => {
        return {
          ...tour,
          rating: 4.5,
          reviews: 120,
          discount: tour.price > 100 ? 10 : null,
        };
      });
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  validatePrice() {
    const isInteger = Number.isInteger(+this.newTour.price);
    this.priceError = !isInteger;
  }

  onFileSelected(event: Event): void {
    // Cast event.target to HTMLInputElement
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  async onSubmit(): Promise<void> {
    // Check if end date is greater than start date
    if (!this.isDateRangeValid(this.newTour.startDate, this.newTour.endDate)) {
      alert('End date must be greater than start date.');
      return;
    }

    if (this.selectedFiles.length === 0) {
      alert('Please select at least one image file.');
      return;
    }

    try {
      // Generate a signature for each upload
      const signatureData = await firstValueFrom(
        this.cloudinaryService.getSignature()
      );

      console.log('Signature data:', signatureData);
      const uploadPromises = this.selectedFiles.map((file) =>
        firstValueFrom(this.cloudinaryService.uploadImage(file, signatureData))
      );

      const imageUrls = await Promise.all(uploadPromises);
      console.log('Image URLs:', imageUrls);

      // this.newTour.safariImages = imageUrls.map((url) => ({ image: url }));
      this.newTour.safariImages = imageUrls.map(
        (url) => url.secure_url || url.url
      );

      console.log('New tour with images:', this.newTour.safariImages);

      await this.addTour();
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  }

  async addTour(): Promise<void> {
    try {
      console.log('New tour:', this.newTour);
      await firstValueFrom(this.tourService.addTour(this.newTour));
      alert('Tour added successfully!');
      await this.getTours();
      this.resetForm();
      this.showForm = false;
    } catch (error) {
      console.error('Error adding tour:', error);
    }
  }

  resetForm(): void {
    this.newTour = {
      safariName: '',
      safariDescription: '',
      startDate: new Date(),
      endDate: new Date(),
      price: 0,
      safariImages: [],
    };
    this.selectedFiles = [];
  }

  getStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    return Array(fullStars).fill(1);
  }
}

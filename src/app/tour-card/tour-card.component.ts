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

  constructor(
    private tourService: TourService,
    private cloudinaryService: CloudinaryService
  ) {}

  ngOnInit(): void {
    this.getTours();
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement; // Cast event.target to HTMLInputElement
    if (input.files) {
      this.selectedFiles = Array.from(input.files); // Convert FileList to Array
    }
  }

  async onSubmit(): Promise<void> {
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
      //Promise.all` to handle multiple uploads and get an array of URLs
      const uploadPromises = this.selectedFiles.map((file) =>
        firstValueFrom(this.cloudinaryService.uploadImage(file, signatureData))
      );

      // Wait for all upload promises to resolve
      const imageUrls = await Promise.all(uploadPromises);

      // Update `newTour.safariImages` with the URLs wrapped in objects
      this.newTour.safariImages = imageUrls.map((url) => ({ image: url }));

      await this.addTour();
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  }

  async addTour(): Promise<void> {
    try {
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

import { Component, OnInit } from '@angular/core';
import { TourService } from '../services/tour.service';
import { IToursandImagesResponseDto, IAddTourDto } from '../models/tour.model'; // Adjust the path as needed
import { firstValueFrom } from 'rxjs';

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

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.getTours();
  }

  async getTours(): Promise<void> {
    try {
      const data = await firstValueFrom(this.tourService.getAllTours());
      this.tours = data.result.map((tour: IToursandImagesResponseDto) => {
        return {
          ...tour,
          rating: 4.5, // Example rating; replace with actual data
          reviews: 120, // Example reviews count; replace with actual data
          discount: tour.price > 100 ? 10 : null, // Example discount logic; adjust as needed
        };
      });
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  onFilesSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  async onSubmit(): Promise<void> {
    if (this.selectedFiles.length === 0) {
      alert('Please select at least one image file.');
      return;
    }

    try {
      const uploadPromises = this.selectedFiles.map((file) =>
        firstValueFrom(this.tourService.uploadImage(file))
      );

      const imageUrls = await Promise.all(uploadPromises);
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
      await this.getTours(); // Refresh the list of tours
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

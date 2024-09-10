import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CloudinaryService } from '../services/cloudinary-signature.service';
import { TourService } from '../services/tour.service'; // Ensure the correct path to your service
import {
  IToursandImagesResponseDto,
  ITourImageDto,
} from '../models/tour.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.css'],
})
export class TourDetailComponent implements OnInit {
  tour: IToursandImagesResponseDto | null = null;
  tourId: string | null = null;
  isAddImageModalOpen: boolean = false; // Track modal visibility
  selectedFiles: File[] = []; // Store multiple files

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService,
    private cloudinaryService: CloudinaryService
  ) {}

  ngOnInit(): void {
    this.tourId = this.route.snapshot.paramMap.get('id');
    if (this.tourId) {
      this.getTour(this.tourId);
    }
  }

  async getTour(tourId: string): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.tourService.getTourById(this.tourId!)
      );
      this.tour = data.result;
      console.log('Tour:', this.tour);
    } catch (error) {
      console.error('Error fetching tour:', error);
    }
  }

  // Open the modal
  openAddImageModal(): void {
    this.isAddImageModalOpen = true;
  }

  // Close the modal
  closeAddImageModal(): void {
    this.isAddImageModalOpen = false;
    this.selectedFiles = []; // Reset file selection
  }

  // Handle multiple file selection
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files); // Store multiple files
    }
  }

  // Submit the selected files and upload to Cloudinary
  async submitImages(): Promise<void> {
    if (this.selectedFiles.length > 0 && this.tourId) {
      try {
        // Generate Cloudinary signature for secure upload
        const signatureData = await firstValueFrom(
          this.cloudinaryService.getSignature()
        );
        console.log('Signature data:', signatureData);

        // Upload each file to Cloudinary and gather URLs
        const uploadPromises = this.selectedFiles.map((file) =>
          firstValueFrom(
            this.cloudinaryService.uploadImage(file, signatureData)
          )
        );
        const uploadResults = await Promise.all(uploadPromises);

        const imageUrls = uploadResults.map(
          (result) => result.secure_url || result.url
        );
        console.log('Uploaded image URLs:', imageUrls);

        // Add the uploaded image URLs to the tour
        const result = await firstValueFrom(
          this.tourService.addImages(this.tourId, imageUrls)
        );

        // Update the tour images array
        imageUrls.forEach((imageUrl) => {
          const newImage: ITourImageDto = { image: imageUrl };
          this.tour?.tourImages?.push(newImage);
        });

        await this.getTour(this.tourId);

        // Close the modal after successful submission
        this.closeAddImageModal();
        console.log('Images added:', result);
      } catch (error) {
        console.error(
          'Error uploading images or adding them to the tour:',
          error
        );
      }
    }
  }
}

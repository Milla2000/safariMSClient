import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CloudinaryService } from '../services/cloudinary-signature.service';
import { TourService } from '../services/tour.service';
import { HotelService } from '../services/hotel.service';
import { IAddHotelDto, IHotel } from '../models/hotel.model';
import {
  IToursandImagesResponseDto,
  ITourImageDto,
} from '../models/tour.model';
import { firstValueFrom } from 'rxjs';
import { IResponseDto } from '../models/user.model';

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.css'],
})
export class TourDetailComponent implements OnInit {
  tour: IToursandImagesResponseDto | null = null;
  hotels: IHotel[] = [];
  fullHotelResponse: IResponseDto<IHotel[]> | null = null;
  tourId: string | null = null;
  // isAddImageModalOpen: boolean = false;
  // isAddHotelModalOpen: boolean = false;
  isModalOpen: boolean = false;
  modalType: 'image' | 'hotel' | null = null;

  selectedFiles: File[] = []; // Store multiple files

  // Variables for new hotel addition
  newHotel: IAddHotelDto = {
    name: '',
    tourId: '',
    adultPrice: 0,
    kidsPrice: 0,
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly tourService: TourService,
    private readonly hotelService: HotelService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  ngOnInit(): void {
    this.tourId = this.route.snapshot.paramMap.get('id');
    if (this.tourId) {
      this.newHotel.tourId = this.tourId;
      this.getTour(this.tourId);
      this.getHotels(this.tourId);
    }
  }

  async getTour(tourId: string): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.tourService.getTourById(this.tourId!)
      );
      this.tour = data.result;
      console.log('Tourz:', this.tour);
    } catch (error) {
      console.error('Error fetching tour:', error);
    }
  }

  // New method to fetch hotels by TourId
  async getHotels(tourId: string): Promise<void> {
    try {
      const hotelData = await firstValueFrom(
        this.hotelService.getHotelsByTourId(tourId)
      );

      // Store the full response
      this.fullHotelResponse = hotelData;

      // If successful, assign the hotels array from result
      if (hotelData.isSuccess) {
        this.hotels = hotelData.result;
      } else {
        console.error('Error:', hotelData.errormessage);
      }

      console.log('Hotels:', this.hotels);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  }

  // Method to navigate to the hotel component with the hotel ID
  navigateToHotel(hotelId: string | null): void {
    if (hotelId) {
      this.router.navigate(['/hotel', hotelId]);
    } else {
      console.error('Invalid hotelId:', hotelId);
    }
  }

  // Generic method to open the modal
  openModal(type: 'image' | 'hotel'): void {
    this.modalType = type;
    this.isModalOpen = true;
  }

  // Generic method to close the modal
  closeModal(): void {
    this.isModalOpen = false;
    this.modalType = null;
    this.selectedFiles = [];
    this.newHotel = {
      name: '',
      tourId: this.tourId!,
      adultPrice: 0,
      kidsPrice: 0,
    }; // Reset hotel form
  }

  // Add new hotel to the tour
  async addHotel(): Promise<void> {
    if (
      this.newHotel.name &&
      this.newHotel.adultPrice &&
      this.newHotel.kidsPrice
    ) {
      try {
        const result = await firstValueFrom(
          this.hotelService.addHotel(this.newHotel)
        );
        console.log('Hotel added:', result);

        // Update the list of hotels after adding the new one
        await this.getHotels(this.tourId!);
        this.closeModal();
      } catch (error) {
        console.error('Error adding hotel:', error);
      }
    } else {
      console.error('Please fill all the hotel details');
    }
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
        this.closeModal();
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

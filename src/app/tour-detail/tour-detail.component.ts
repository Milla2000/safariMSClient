import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../services/tour.service'; // Ensure the correct path to your service
import { IToursandImagesResponseDto } from '../models/tour.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.css'],
})
export class TourDetailComponent implements OnInit {
  tour: IToursandImagesResponseDto | null = null;
  tourId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService
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
}

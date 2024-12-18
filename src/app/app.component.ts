import { Component, OnInit } from '@angular/core';
import { TourService } from './services/tour.service';
import { IToursandImagesResponseDto } from './models/tour.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  tours: IToursandImagesResponseDto[] = [];

  constructor(private readonly tourService: TourService) {}

  ngOnInit(): void {
    this.tourService.getAllTours().subscribe((data) => {
      console.log('Tours:', data);
      this.tours = data.result;
      console.log('Tours:', this.tours);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { TourService, Tour } from './services/tour.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  tours: Tour[] = [];

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.tourService.getTours().subscribe((data) => {
      this.tours = data;
    });
  }
}

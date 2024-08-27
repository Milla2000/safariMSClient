import { Component, OnInit } from '@angular/core';
import { TourService } from './services/tour.service';
import {  ITour } from './models/tour.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  tours: ITour[] = [];

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.tourService.getAllTours().subscribe((data) => {
      this.tours = data;
    });
  }
}

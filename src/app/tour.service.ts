import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define an interface for the tour data
export interface Tour {
  image: string;
  location: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  discount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private apiUrl = 'https://localhost:7032/api/Tour/'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  // Method to fetch tours from the backend
  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(this.apiUrl);
  }
}

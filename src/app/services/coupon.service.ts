import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddCouponDto } from '../models/coupon.model';
import { IResponseDto } from '../models/user.model';


@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private readonly apiUrl = 'https://localhost:7269/api/Coupon';

  constructor(private readonly http: HttpClient) {}

  // Get all coupons
  getAllCoupons(): Observable<IResponseDto> {
    return this.http
      .get<IResponseDto>(`${this.apiUrl}/getAll`)
      .pipe(map((response: IResponseDto) => response));
  }

  // Get a single coupon by ID
  getCouponById(id: string): Observable<IResponseDto> {
    return this.http
      .get<IResponseDto>(`${this.apiUrl}/single/${id}`)
      .pipe(map((response: IResponseDto) => response));
  }

  // Get a coupon by code
  getCouponByCode(code: string): Observable<IResponseDto> {
    return this.http
      .get<IResponseDto>(`${this.apiUrl}/getCoupun/${code}`)
      .pipe(map((response: IResponseDto) => response));
  }

  // Add a new coupon
  addCoupon(newCoupon: AddCouponDto): Observable<IResponseDto> {
    return this.http
      .post<IResponseDto>(`${this.apiUrl}/addCoupon`, newCoupon)
      .pipe(map((response: IResponseDto) => response));
  }

  // Update an existing coupon by ID
  updateCoupon(
    id: string,
    updatedCoupon: AddCouponDto
  ): Observable<IResponseDto> {
    return this.http
      .put<IResponseDto>(`${this.apiUrl}/updateCoupon/${id}`, updatedCoupon)
      .pipe(map((response: IResponseDto) => response));
  }

  // Delete a coupon by ID
  deleteCoupon(id: string): Observable<IResponseDto> {
    return this.http
      .delete<IResponseDto>(`${this.apiUrl}/deleteCoupon/${id}`)
      .pipe(map((response: IResponseDto) => response));
  }
}

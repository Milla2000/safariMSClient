import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddCouponDto, ICouponResponseDto } from '../models/coupon.model';
import { IResponseDto } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private readonly apiUrl = 'https://localhost:7198/api/Coupon';

  constructor(private readonly http: HttpClient) {}

  // Get all coupons
  getAllCoupons(): Observable<ICouponResponseDto> {
    return this.http
      .get<ICouponResponseDto>(`${this.apiUrl}/getAll`)
      .pipe(map((response: ICouponResponseDto) => response));
  }

  // Get a single coupon by ID
  getCouponById(id: string): Observable<ICouponResponseDto> {
    return this.http
      .get<ICouponResponseDto>(`${this.apiUrl}/single/${id}`)
      .pipe(map((response: ICouponResponseDto) => response));
  }

  // Get a coupon by code
  getCouponByCode(code: string): Observable<ICouponResponseDto> {
    return this.http
      .get<ICouponResponseDto>(`${this.apiUrl}/getCoupun/${code}`)
      .pipe(map((response: ICouponResponseDto) => response));
  }

  // Add a new coupon
  addCoupon(newCoupon: AddCouponDto): Observable<ICouponResponseDto> {
    return this.http
      .post<ICouponResponseDto>(`${this.apiUrl}/addCoupon`, newCoupon)
      .pipe(map((response: ICouponResponseDto) => response));
  }

  // Update an existing coupon by ID
  updateCoupon(
    id: string,
    updatedCoupon: AddCouponDto
  ): Observable<ICouponResponseDto> {
    return this.http
      .put<ICouponResponseDto>(
        `${this.apiUrl}/updateCoupon/${id}`,
        updatedCoupon
      )
      .pipe(map((response: ICouponResponseDto) => response));
  }

  // Delete a coupon by ID
  deleteCoupon(id: string): Observable<ICouponResponseDto> {
    return this.http
      .delete<ICouponResponseDto>(`${this.apiUrl}/deleteCoupon/${id}`)
      .pipe(map((response: ICouponResponseDto) => response));
  }
}

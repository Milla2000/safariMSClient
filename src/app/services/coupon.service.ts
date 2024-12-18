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
  private readonly apiUrl = 'https://localhost:7198/api/Coupon';

  constructor(private readonly http: HttpClient) {}

  // Get all coupons
  getAllCoupons(): Observable<IResponseDto<AddCouponDto[]>> {
    return this.http
      .get<IResponseDto<AddCouponDto[]>>(`${this.apiUrl}/getAll`)
      .pipe(map((response: IResponseDto<AddCouponDto[]>) => response));
  }

  // Get a single coupon by ID
  getCouponById(id: string): Observable<IResponseDto<AddCouponDto[]>> {
    return this.http
      .get<IResponseDto<AddCouponDto[]>>(`${this.apiUrl}/single/${id}`)
      .pipe(map((response: IResponseDto<AddCouponDto[]>) => response));
  }

  // Get a coupon by code
  getCouponByCode(code: string): Observable<IResponseDto<AddCouponDto[]>> {
    return this.http
      .get<IResponseDto<AddCouponDto[]>>(`${this.apiUrl}/getCoupun/${code}`)
      .pipe(map((response: IResponseDto<AddCouponDto[]>) => response));
  }

  // Add a new coupon
  addCoupon(newCoupon: AddCouponDto): Observable<IResponseDto<AddCouponDto[]>> {
    return this.http
      .post<IResponseDto<AddCouponDto[]>>(`${this.apiUrl}/addCoupon`, newCoupon)
      .pipe(map((response: IResponseDto<AddCouponDto[]>) => response));
  }

  // Update an existing coupon by ID
  updateCoupon(
    id: string,
    updatedCoupon: AddCouponDto
  ): Observable<IResponseDto<AddCouponDto[]>> {
    return this.http
      .put<IResponseDto<AddCouponDto[]>>(
        `${this.apiUrl}/updateCoupon/${id}`,
        updatedCoupon
      )
      .pipe(map((response: IResponseDto<AddCouponDto[]>) => response));
  }

  // Delete a coupon by ID
  deleteCoupon(id: string): Observable<IResponseDto<AddCouponDto[]>> {
    console.log('Deleting coupon:', id);
    return this.http
      .delete<IResponseDto<AddCouponDto[]>>(`${this.apiUrl}/deleteCoupon/${id}`)
      .pipe(map((response: IResponseDto<AddCouponDto[]>) => response));
  }
}

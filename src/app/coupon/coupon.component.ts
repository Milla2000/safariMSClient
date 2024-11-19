import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CouponService } from '../services/coupon.service';
import { AddCouponDto, ICouponResponseDto } from '../models/coupon.model';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css'],
})
export class CouponComponent implements OnInit {
  couponForm: FormGroup;
  coupons: AddCouponDto[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private couponService: CouponService
  ) {
    this.couponForm = this.formBuilder.group({
      couponCode: ['', Validators.required],
      couponAmount: [
        100,
        [Validators.required, Validators.min(100), Validators.max(100000)],
      ],
      couponMinAmount: [1000, [Validators.required, Validators.min(1000)]],
    });
  }

  ngOnInit(): void {
    this.getCoupons();
  }

  // Fetch all coupons
  getCoupons() {
    this.isLoading = true;
    this.couponService.getAllCoupons().subscribe({
      next: (response) => {
        this.coupons = [response.result.coupon];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  // Add a new coupon
  addCoupon() {
    if (this.couponForm.invalid) {
      return;
    }
    const newCoupon: AddCouponDto = this.couponForm.value;
    this.couponService.addCoupon(newCoupon).subscribe({
      next: (response) => {
        this.coupons.push(response.result.coupon);
        this.couponForm.reset();
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }

  // Delete a coupon by ID
  deleteCoupon(couponId: string) {
    this.couponService.deleteCoupon(couponId).subscribe({
      next: () => {
        this.coupons = this.coupons.filter((c) => c.couponCode !== couponId);
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }
}

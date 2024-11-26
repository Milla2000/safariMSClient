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
  isEdit = false;
  editingCouponCode: string | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly couponService: CouponService
  ) {
    this.couponForm = this.formBuilder.group({
      couponCode: ['', Validators.required],
      couponAmount: [100, [Validators.required, Validators.min(100)]],
      couponMinAmount: [1000, [Validators.required, Validators.min(1000)]],
    });
  }

  ngOnInit(): void {
    this.getCoupons();
  }

  getCoupons() {
    this.isLoading = true;
    this.couponService.getAllCoupons().subscribe({
      next: (response: ICouponResponseDto) => {
        this.coupons = response.result || [];
        console.log('Coupons:', this.coupons);
        // this.filterBestCouponForAmount(30);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }


  filterBestCouponForAmount(amount: number) {
    // Find the best coupon whose min amount has been attained
    const validCoupons = this.coupons.filter(
      (coupon) => coupon.couponMinAmount <= amount
    ); // Filter by minAmount condition

    if (validCoupons.length === 0) {
      console.log('No valid coupon found for the specified amount.');
      return null;
    }

    const bestCoupon = validCoupons.reduce(
      (best, current) =>
        current.couponAmount > best.couponAmount ? current : best,
      validCoupons[0]
    ); 

    console.log('Best coupon for the customer:', bestCoupon);
    return bestCoupon;
  }
  

  addCoupon() {
    if (this.couponForm.invalid) {
      console.log('Invalid form');
      return;
    }
    const newCoupon: AddCouponDto = this.couponForm.value;
    this.couponService.addCoupon(newCoupon).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          // Optionally, you can fetch the coupons again to update the list
          this.getCoupons();
          this.couponForm.reset();
        } else {
          this.errorMessage = response.errormessage;
        }
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }

  populateForm(coupon: AddCouponDto) {
    this.couponForm.patchValue(coupon);
    this.isEdit = true;
    this.editingCouponCode = coupon.id;
  }

  updateCoupon() {
    if (!this.editingCouponCode || this.couponForm.invalid) {
      return;
    }
    const updatedCoupon: AddCouponDto = this.couponForm.value;
    this.couponService
      .updateCoupon(this.editingCouponCode, updatedCoupon)
      .subscribe({
        next: () => {
          this.getCoupons();
          this.couponForm.reset();
          this.isEdit = false;
          this.editingCouponCode = null;
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
      });
  }

  deleteCoupon(couponCode: string) {
    // console.log('Deleting coupon:', couponCode);
    this.couponService.deleteCoupon(couponCode).subscribe({
      next: () => {
        this.coupons = this.coupons.filter((c) => c.couponCode !== couponCode);
        this.getCoupons();
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }
}

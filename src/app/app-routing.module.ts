import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TourComponent } from './tour-card/tour-card.component';
import { RoleGuard, AuthGuard } from './auth/role.guard';
import { TourDetailComponent } from './tour-detail/tour-detail.component';
import { HotelCardComponent } from './hotel-card/hotel-card.component';
import { BookingCardComponent } from './booking-card/booking-card.component';
import { ValidatePaymentComponent } from './validate-payment/validate-payment.component';
import { CouponComponent } from './coupon/coupon.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tour/:id', component: TourDetailComponent },
  { path: 'hotel/:id', component: HotelCardComponent },

  {
    path: 'bookingatour/:id',
    component: BookingCardComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'validatepayment/:id',
    component: ValidatePaymentComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
  },

  {
    path: 'tour',
    component: TourComponent,
    canActivate: [
      AuthGuard
    ]
  },

  //add a route to the coupon component
  {
    path: 'coupon',
    component: CouponComponent,
    canActivate: [
      AuthGuard,
      (route: ActivatedRouteSnapshot) => RoleGuard(route),
    ],
    data: { role: 'admin' },
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule{ }

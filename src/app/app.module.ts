import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { FirstSectionComponent } from './first-section/first-section.component';
import { TourComponent } from './tour-card/tour-card.component';
import { AuthService } from './services//auth.service';
import { TourDetailComponent } from './tour-detail/tour-detail.component';
import { HotelCardComponent } from './hotel-card/hotel-card.component';
import { BookingCardComponent } from './booking-card/booking-card.component';
import { ValidatePaymentComponent } from './validate-payment/validate-payment.component';
import { CouponComponent } from './coupon/coupon.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    FooterComponent,
    FirstSectionComponent,
    TourComponent,
    TourDetailComponent,
    HotelCardComponent,
    BookingCardComponent,
    ValidatePaymentComponent,
    CouponComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

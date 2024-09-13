import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TourComponent } from './tour-card/tour-card.component';
import { RoleGuard, AuthGuard } from './auth/role.guard';
import { TourDetailComponent } from './tour-detail/tour-detail.component';
import { HotelCardComponent } from './hotel-card/hotel-card.component';
// import {  } from '@angular/router';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tour/:id', component: TourDetailComponent },
  { path: 'hotel/:id', component: HotelCardComponent },
  //  {
  //     path: 'dashboard',
  //     component: DashboardComponent,
  //     // canActivate: [AuthGuard],
  //   },

  // { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'tour',
    component: TourComponent,
    canActivate: [
      AuthGuard,
      (route: ActivatedRouteSnapshot) => RoleGuard(route),
    ],
    data: { role: 'admin' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ILoginRequestDto, IResponseDto } from '../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginDto: ILoginRequestDto = {
    Username: '',
    Password: '',
  };
  userId: string = '';
  userData: any;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Call getUserData when component initializes
    this.getUserData();
  }

  login(): void {
    this.authService
      .loginUser(this.loginDto)
      .subscribe((response: IResponseDto) => {
        if (response.isSuccess) {
          // Login success
          console.log('User logged in successfully', response);
          localStorage.setItem('token', response.result.token);
          localStorage.setItem('user', JSON.stringify(response.result.user));
          localStorage.setItem('role', response.result.role);

          // Use this.route.snapshot instead of this.router.snapshot
          const returnUrl =
            this.route.snapshot.queryParams['returnUrl'] || '/tour';
          // this.route.routerState.queryParams['returnUrl'] || '/tour';
          this.router.navigateByUrl(returnUrl);
        } else {
          console.error('Login failed:', response.errormessage);
        }
      });
  }

  getUserData(): void {
    this.authService
      .getUserById('e23f78bf-6fe8-4aab-a96a-59ba86054299')
      .subscribe((response: IResponseDto) => {
        if (response.isSuccess) {
          this.userData = response.result;
          console.log('User data:', this.userData);
        } else {
          console.log('Failed to get user data:', response.errormessage);
        }
      });
  }
}

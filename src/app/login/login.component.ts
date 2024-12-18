import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { ILoginRequestDto, IResponseDto, ResultDto } from '../models/user.model';

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
    private readonly route: ActivatedRoute,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Call getUserData when component initializes
    this.getUserData();
  }

  login(): void {
    this.authService
      .loginUser(this.loginDto)
      .subscribe((response: IResponseDto<ResultDto>) => {
        if (response.isSuccess) {
          // Login success
          localStorage.setItem('token', response.result.token);
          localStorage.setItem('user', JSON.stringify(response.result.user));
          localStorage.setItem('role', response.result.role);

          const returnUrl =this.route.snapshot.queryParams['returnUrl'] || '/tour';

          this.router.navigateByUrl(returnUrl);

        } else {
          this.toastService.showToast(`Login failed:, ${response.errormessage}`);
        }
      });
  }

  getUserData(): void {
    this.authService
      .getUserById(this.userId)
      .subscribe((response: IResponseDto<ResultDto>) => {
        if (response.isSuccess) {
          this.userData = response.result;
        } else {
          this.toastService.showToast(`Failed to get user data:, ${response.errormessage}`);
        }
      });
  }
}

import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ILoginRequestDto, IResponseDto} from '../models/user.model';

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

  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    // Call getUserData when component initializes
    this.getUserData();
  }

  login(): void {
    this.authService
      .loginUser(this.loginDto)
      .subscribe((response: IResponseDto) => {
        // Handle response
        if (response.isSuccess) {
          // Login success
          console.log('User logged in successfully', response);
          // Save token and user to local storage
          localStorage.setItem('token', response.result.token);
          localStorage.setItem('user', JSON.stringify(response.result.user));
          localStorage.setItem('role', response.result.role);
        } else {
          console.error('Login failed:', response.errormessage);
        }
      });
  }

  getUserData(): void {
    this.authService.getUserById('1').subscribe((response: IResponseDto) => {
      if (response.isSuccess) {
        this.userData = response.result;
        console.log('User data:', this.userData);
      } else {
        console.log('Failed to get user data:', response.errormessage);
      }
    });
  }
}

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

  constructor(private authService: AuthService) {}

  login(): void {
  this.authService.loginUser(this.loginDto).subscribe((response: IResponseDto) => {
    // Handle response
    if (response.isSuccess) {
      // Login success
      console.log('User logged in successfully');
      // Save token and user to local storage
      localStorage.setItem('token', response.result.token);
      localStorage.setItem('user', JSON.stringify(response.result.user));
    } else {
      // Handle unsuccessful login
      if (response.errormessage) {
        console.error('Login failed:', response.errormessage);
      } else {
        console.error('Login failed: Unknown error');
      }
    }
  });
}

}

import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IUserDto, IResponseDto } from '../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  userDto: IUserDto = {
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: '',
  };
  registrationResponse?: IResponseDto;

  constructor(private readonly authService: AuthService) {}

  register(): void {
    this.authService.registerUser(this.userDto).subscribe((response) => {
      this.registrationResponse = response;
      console.log(this.registrationResponse);
      // Handle response
      if (this.registrationResponse.isSuccess) {
        // Registration success
        console.log('User registered successfully');
      } else {
        // Registration failed
        console.error(
          'Registration failed:',
          this.registrationResponse.errormessage
        );
      }
    });
  }
}

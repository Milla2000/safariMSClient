import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IUserDto, IResponseDto, ResultDto } from '../models/user.model';
import { ToastService } from '../services/toast.service';

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
  registrationResponse?: IResponseDto<ResultDto>;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router, 
    private readonly toastservice: ToastService
   ) {}

  register(): void {
    this.authService.registerUser(this.userDto).subscribe((response) => {
      try {
        this.registrationResponse = response;
        console.log(this.registrationResponse);
        // Handle response
        if (this.registrationResponse.isSuccess) {
          this.router.navigate(['/login']);
        } else {
          this.toastservice.showToast(`Registration failed: ${this.registrationResponse.errormessage}`);
        }
      } catch (error) {
        this.toastservice.showToast('Error registering user');
      }
    });
  }
}

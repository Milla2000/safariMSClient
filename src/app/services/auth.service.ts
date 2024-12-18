import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AssignRoleDto,
  ILoginRequestDto,
  IResponseDto,
  IUserDto,
  ResultDto,
  // LoginResponseDto,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://localhost:7269/api/User';

  constructor(private readonly http: HttpClient) {}

  registerUser(registerUserDto: IUserDto): Observable<IResponseDto<ResultDto>> {
    return this.http
      .post<IResponseDto<ResultDto>>(`${this.apiUrl}`, registerUserDto)
      .pipe(
        map((response: IResponseDto<ResultDto>) => {
          return response;
        })
      );
  }

  loginUser(loginRequestDto: ILoginRequestDto): Observable<IResponseDto<ResultDto>> {
    return this.http.post<IResponseDto<ResultDto>>(
      `${this.apiUrl}/login`,
      loginRequestDto
    );
  }

  assignRole(assignRoleDto: AssignRoleDto): Observable<IResponseDto<ResultDto>> {
    return this.http
      .post<IResponseDto<ResultDto>>(`${this.apiUrl}/AssignRole`, assignRoleDto)
      .pipe(
        map((response: IResponseDto<ResultDto>) => {
          return response;
        })
      );
  }

  getUserById(id: string): Observable<IResponseDto<ResultDto>> {
    return this.http.get<IResponseDto<ResultDto>>(`${this.apiUrl}/${id}`).pipe(
      map((response: IResponseDto<ResultDto>) => {
        return response;
      })
    );
  }

  getTokenandRole(): { token: string | null; role: string | null } {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return { token: token, role: role };
  }
}

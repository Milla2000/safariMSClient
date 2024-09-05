import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AssignRoleDto,
  ILoginRequestDto,
  IResponseDto,
  IUserDto,
  // LoginResponseDto,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7269/api/User';

  constructor(private http: HttpClient) {}

  registerUser(registerUserDto: IUserDto): Observable<IResponseDto> {
    return this.http.post<IResponseDto>(`${this.apiUrl}`, registerUserDto).pipe(
      map((response: IResponseDto) => {
        return response;
      })
    );
  }

  loginUser(loginRequestDto: ILoginRequestDto): Observable<IResponseDto> {
    return this.http.post<IResponseDto>(
      `${this.apiUrl}/login`,
      loginRequestDto
    );
  }

  assignRole(assignRoleDto: AssignRoleDto): Observable<IResponseDto> {
    return this.http
      .post<IResponseDto>(`${this.apiUrl}/AssignRole`, assignRoleDto)
      .pipe(
        map((response: IResponseDto) => {
          return response;
        })
      );
  }

  getUserById(id: string): Observable<IResponseDto> {
    return this.http.get<IResponseDto>(`${this.apiUrl}/${id}`).pipe(
      map((response: IResponseDto) => {
        return response;
      })
    );
  }
  // AuthService to get token and role
  // getToken(): string | null {
  //   return localStorage.getItem('token');
  // }
  // AuthService to get token and role
  getTokenandRole(): { token: string | null; role: string | null } {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return { token: token, role: role };
  }
}

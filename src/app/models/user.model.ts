export interface IUserDto {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    role?: string;
}

export interface IResponseDto<T> {
  errormessage: string;
  result: T ;
  isSuccess: boolean;
}

export interface ResultDto {
  token: string;
  user: UserDto;
  role: string;
  message: string;
  total: number;
}


export interface ILoginRequestDto{
  Username: string;
  Password: string;
}

export interface UserDto {
        Guid: string;
        Name: string;
        Email: string;
        PhoneNumber: string;
}



export interface AssignRoleDto {
  email: string;
  role: string;
}

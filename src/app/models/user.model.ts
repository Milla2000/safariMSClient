export interface IUserDto {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    role?: string;
}

export interface IResponseDto {
  errormessage: string;
  result: {
    token: string;
    user: UserDto;
    role: string;
  };

  isSuccess: boolean;
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


// export interface LoginResponseDto{
//     Token: string;
//     User: UserDto;
//     Role: string;
// }


export interface AssignRoleDto {
  email: string;
  role: string;
}

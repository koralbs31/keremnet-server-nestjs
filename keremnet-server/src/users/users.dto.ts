/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsOptional, IsString, IsStrongPassword, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(20)
  username: string;

  @IsEmail()
  @MaxLength(40)
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;


  @IsOptional()
  @IsString()
  profilePicFileName?: string;
}

export class LoginUserDto {
  @IsEmail()
  @MaxLength(40)  
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  username?: string;

  @IsOptional()
  @IsString()
  profilePicFileName?: string;
}

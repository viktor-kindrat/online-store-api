import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @IsString()
  @MaxLength(100)
  password!: string;
}

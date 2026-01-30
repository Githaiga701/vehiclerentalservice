import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RequestOtpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  phone!: string;
}

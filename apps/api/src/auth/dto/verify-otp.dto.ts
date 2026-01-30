import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  phone!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  code!: string;
}

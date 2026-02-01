import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(15)
  @Matches(/^(\+254|254|0)[17]\d{8}$/, {
    message: 'Phone number must be a valid Kenyan phone number'
  })
  phone!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @Matches(/^\d{6}$/, {
    message: 'OTP must be exactly 6 digits'
  })
  code!: string;
}

import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(15)
  @Matches(/^(\+254|254|0)(7[0-9]|1[0-9]|8[0-9]|9[0-9])\d{7}$/, {
    message: 'Phone number must be a valid Kenyan phone number (e.g., 0712345678 or +254712345678)'
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

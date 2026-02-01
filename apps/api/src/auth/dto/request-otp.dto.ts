import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(15)
  @Matches(/^(\+254|254|0)[17]\d{8}$/, {
    message: 'Phone number must be a valid Kenyan phone number'
  })
  phone!: string;
}

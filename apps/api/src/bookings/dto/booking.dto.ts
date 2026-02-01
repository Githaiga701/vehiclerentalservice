import { 
  IsNotEmpty, 
  IsString, 
  IsDateString, 
  IsOptional, 
  IsBoolean, 
  IsObject, 
  IsNumber,
  IsEnum 
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  vehicleId!: string;

  @IsNotEmpty()
  @IsDateString()
  startDate!: string;

  @IsNotEmpty()
  @IsDateString()
  endDate!: string;

  @IsNotEmpty()
  @IsString()
  pickupTime!: string;

  @IsNotEmpty()
  @IsString()
  returnTime!: string;

  @IsNotEmpty()
  @IsString()
  driverName!: string;

  @IsNotEmpty()
  @IsString()
  driverPhone!: string;

  @IsNotEmpty()
  @IsString()
  driverLicense!: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsBoolean()
  needsDelivery?: boolean;

  @IsOptional()
  @IsObject()
  pickupLocation?: {
    lat: number;
    lng: number;
    address: string;
    city: string;
  };

  @IsOptional()
  @IsObject()
  dropoffLocation?: {
    lat: number;
    lng: number;
    address: string;
    city: string;
  };

  @IsOptional()
  @IsNumber()
  totalPrice?: number;
}

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsEnum(['PENDING', 'CONFIRMED', 'CANCELLED', 'PAYMENT_CONFIRMED'])
  status!: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'PAYMENT_CONFIRMED';
}
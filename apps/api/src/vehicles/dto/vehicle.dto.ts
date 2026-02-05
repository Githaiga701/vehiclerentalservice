import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  make!: string;

  @IsNotEmpty()
  @IsString()
  model!: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  year!: number;

  @IsNotEmpty()
  @IsString()
  category!: string;

  @IsNotEmpty()
  @IsString()
  transmission!: string;

  @IsNotEmpty()
  @IsString()
  fuelType!: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  seats!: number;

  @IsOptional()
  @IsString()
  engineSize?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  mileage?: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  dailyPrice!: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  weeklyDiscount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  monthlyDiscount?: number;

  // Leasing options
  @IsOptional()
  @IsBoolean()
  availableForLease?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(6)
  leaseMinDuration?: number; // Minimum 6 months

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  leaseMonthlyPrice?: number;

  @IsNotEmpty()
  @IsString()
  location!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  features?: string; // JSON string of features array

  @IsOptional()
  @IsString()
  images?: string;

  @IsOptional()
  @IsString()
  documents?: string;

  // Legacy field for backward compatibility
  @IsOptional()
  @IsString()
  title?: string;
}

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  dailyPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  monthlyPrice?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  images?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  seats?: number;

  @IsOptional()
  @IsString()
  transmission?: string;

  @IsOptional()
  @IsString()
  fuelType?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsBoolean()
  withDriver?: boolean;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

export class VehicleSearchDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  seats?: number;

  @IsOptional()
  @IsString()
  transmission?: string;

  @IsOptional()
  @IsString()
  fuelType?: string;

  @IsOptional()
  @IsBoolean()
  withDriver?: boolean;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}

export class AssignDriverDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  licenseNo?: string;
}

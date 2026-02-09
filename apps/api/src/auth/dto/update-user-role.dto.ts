import { IsEnum, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserRoleDto {
  @IsString()
  phone: string;

  @IsEnum(UserRole)
  role: UserRole;
}

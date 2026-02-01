import { 
  Controller, 
  Post, 
  Get, 
  Put,
  Param,
  Body, 
  UseGuards, 
  UseInterceptors, 
  UploadedFiles,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { KycService } from './kyc.service';
import { CreateKycDto } from './dto/kyc.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('kyc')
@UseGuards(JwtAuthGuard)
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'idFront', maxCount: 1 },
    { name: 'idBack', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]))
  async submitKyc(
    @CurrentUser() user: any,
    @Body() dto: CreateKycDto,
    @UploadedFiles() files: {
      idFront?: Express.Multer.File[];
      idBack?: Express.Multer.File[];
      selfie?: Express.Multer.File[];
    }
  ) {
    return this.kycService.submitKyc(user.sub, dto, files);
  }

  @Get('status')
  async getKycStatus(@CurrentUser() user: any) {
    return this.kycService.getKycStatus(user.sub);
  }

  // Admin endpoints
  @Get('admin/pending')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async getPendingKyc(@CurrentUser() user: any) {
    return this.kycService.getPendingKyc();
  }

  @Put('admin/:userId/approve')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async approveKyc(
    @Param('userId') userId: string,
    @CurrentUser() user: any
  ) {
    return this.kycService.updateKycStatus(userId, 'APPROVED');
  }

  @Put('admin/:userId/reject')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async rejectKyc(
    @Param('userId') userId: string,
    @CurrentUser() user: any
  ) {
    return this.kycService.updateKycStatus(userId, 'REJECTED');
  }
}
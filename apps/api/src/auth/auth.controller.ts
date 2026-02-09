import { Controller, Post, Get, Put, Body, UseGuards, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Param, HttpException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { RedisService } from '../database/redis.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}

  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto.phone);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.phone, dto.code);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: any) {
    return this.authService.getCurrentUser(user.sub);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@CurrentUser() user: any, @Body() data: { name?: string; email?: string }) {
    return this.authService.updateProfile(user.sub, data);
  }

  @Post('profile-picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profilePicture'))
  async uploadProfilePicture(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.authService.uploadProfilePicture(user.sub, file);
  }

  @Put('profile-picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profilePicture'))
  async updateProfilePicture(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.authService.uploadProfilePicture(user.sub, file);
  }

  @Get('admin/otps')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllOtps() {
    if (!this.redisService.isAvailable()) {
      return {
        message: 'Redis not available. OTPs are stored in database.',
        otps: [],
        redisAvailable: false,
      };
    }

    const otps = await this.redisService.getAllOtps();
    return {
      message: 'Active OTPs retrieved successfully',
      otps,
      redisAvailable: true,
      count: otps.length,
    };
  }

  // Admin Management Endpoints
  @Put('admin/users/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateUserRole(@Body() dto: UpdateUserRoleDto) {
    return this.authService.updateUserRole(dto.phone, dto.role);
  }

  @Post('admin/make-admin/:phone')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async makeAdmin(@Param('phone') phone: string) {
    return this.authService.makeAdmin(phone);
  }

  @Get('admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  // Public endpoint to make first admin (no auth required)
  @Post('setup/make-admin')
  @HttpCode(HttpStatus.OK)
  async setupAdmin(@Body() dto: { phone: string; secretKey: string }) {
    // Check secret key from environment
    const setupSecret = process.env.ADMIN_SETUP_SECRET || 'change-this-secret-key';
    
    if (dto.secretKey !== setupSecret) {
      throw new HttpException('Invalid secret key', HttpStatus.FORBIDDEN);
    }

    return this.authService.makeAdmin(dto.phone);
  }
}

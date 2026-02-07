import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto, VehicleSearchDto, AssignDriverDto } from './dto/vehicle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 10 },
    { name: 'documents', maxCount: 5 }
  ]))
  async create(
    @CurrentUser() user: any, 
    @Body() dto: CreateVehicleDto,
    @UploadedFiles() files: { images?: Express.Multer.File[], documents?: Express.Multer.File[] }
  ) {
    return this.vehiclesService.create(user.sub, dto, files);
  }

  @Get()
  async findAll(@Query() searchDto: VehicleSearchDto) {
    return this.vehiclesService.findAll(searchDto);
  }

  @Get('my-vehicles')
  @UseGuards(JwtAuthGuard)
  async getMyVehicles(@CurrentUser() user: any) {
    return this.vehiclesService.getOwnerVehicles(user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, user.sub, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.vehiclesService.remove(id, user.sub);
  }

  @Post(':id/driver')
  @UseGuards(JwtAuthGuard)
  async assignDriver(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: AssignDriverDto) {
    return this.vehiclesService.assignDriver(id, user.sub, dto);
  }

  @Delete(':id/driver')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async removeDriver(@Param('id') id: string, @CurrentUser() user: any) {
    return this.vehiclesService.removeDriver(id, user.sub);
  }

  @Put(':id/availability')
  @UseGuards(JwtAuthGuard)
  async updateAvailability(@Param('id') id: string, @CurrentUser() user: any, @Body('isAvailable') isAvailable: boolean) {
    return this.vehiclesService.updateAvailability(id, user.sub, isAvailable);
  }

  // Admin endpoints
  @Put(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async approveVehicle(@Param('id') id: string) {
    return this.vehiclesService.updateStatus(id, 'APPROVED');
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async rejectVehicle(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.vehiclesService.updateStatus(id, 'REJECTED', reason);
  }

  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getPendingVehicles() {
    return this.vehiclesService.getPendingVehicles();
  }
}

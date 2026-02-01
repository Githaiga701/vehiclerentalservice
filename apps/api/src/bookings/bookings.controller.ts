import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Body, 
  Param, 
  UseGuards, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBooking(@CurrentUser() user: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(user.sub, dto);
  }

  @Get('my-bookings')
  async getMyBookings(@CurrentUser() user: any) {
    return this.bookingsService.getUserBookings(user.sub);
  }

  @Get('owner-bookings')
  async getOwnerBookings(@CurrentUser() user: any) {
    return this.bookingsService.getOwnerBookings(user.sub);
  }

  @Get(':id')
  async getBooking(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.getBooking(id, user.sub);
  }

  @Put(':id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateBookingStatusDto
  ) {
    return this.bookingsService.updateBookingStatus(id, user.sub, dto.status);
  }
}
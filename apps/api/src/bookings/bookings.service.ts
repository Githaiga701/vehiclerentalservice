import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(renterId: string, dto: CreateBookingDto) {
    // Validate dates
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    
    if (startDate >= endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    // Get vehicle and check availability
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: dto.vehicleId },
      include: { owner: true },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (!vehicle.isAvailable) {
      throw new BadRequestException('Vehicle is not available');
    }

    // Check for conflicting bookings
    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        vehicleId: dto.vehicleId,
        status: { in: ['PENDING', 'CONFIRMED', 'PAYMENT_CONFIRMED'] },
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

    if (conflictingBooking) {
      throw new BadRequestException('Vehicle is already booked for the selected dates');
    }

    // Calculate total price
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = days * (vehicle.dailyPrice || 0);
    const deliveryFee = dto.needsDelivery ? 2000 : 0;
    const totalPrice = basePrice + deliveryFee;

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        renterId,
        vehicleId: dto.vehicleId,
        ownerId: vehicle.ownerId,
        startDate,
        endDate,
        totalPrice,
        status: 'PENDING',
        pickupTime: dto.pickupTime,
        returnTime: dto.returnTime,
        driverName: dto.driverName,
        driverPhone: dto.driverPhone,
        driverLicense: dto.driverLicense,
        specialRequests: dto.specialRequests,
        needsDelivery: dto.needsDelivery,
        pickupLocation: dto.pickupLocation ? JSON.stringify(dto.pickupLocation) : null,
        dropoffLocation: dto.dropoffLocation ? JSON.stringify(dto.dropoffLocation) : null,
      },
      include: {
        vehicle: {
          include: {
            owner: { select: { id: true, name: true, phone: true } },
          },
        },
        renter: { select: { id: true, name: true, phone: true } },
      },
    });

    return {
      message: 'Booking request submitted successfully',
      booking,
    };
  }

  async getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { renterId: userId },
      include: {
        vehicle: {
          include: {
            owner: { select: { id: true, name: true, phone: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOwnerBookings(ownerId: string) {
    return this.prisma.booking.findMany({
      where: { ownerId },
      include: {
        vehicle: true,
        renter: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: {
          include: {
            owner: { select: { id: true, name: true, phone: true, email: true } },
          },
        },
        renter: { select: { id: true, name: true, phone: true, email: true } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user has access to this booking
    if (booking.renterId !== userId && booking.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  async updateBookingStatus(bookingId: string, userId: string, status: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only owner can approve/decline bookings
    if (booking.ownerId !== userId) {
      throw new ForbiddenException('Only the vehicle owner can update booking status');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: status as any },
      include: {
        vehicle: {
          include: {
            owner: { select: { id: true, name: true, phone: true } },
          },
        },
        renter: { select: { id: true, name: true, phone: true } },
      },
    });

    return {
      message: `Booking ${status.toLowerCase()} successfully`,
      booking: updatedBooking,
    };
  }
}
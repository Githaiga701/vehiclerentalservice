import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../database/prisma.service';
import { mockPrismaService } from '../test/test-utils';

describe('BookingsService', () => {
  let service: BookingsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prisma = mockPrismaService;

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBooking', () => {
    it('should create a new booking', async () => {
      const renterId = 'renter-1';
      const createDto = {
        vehicleId: 'vehicle-1',
        startDate: '2026-03-01',
        endDate: '2026-03-05',
        pickupTime: '10:00',
        returnTime: '10:00',
        driverName: 'John Doe',
        driverPhone: '+254712345678',
        driverLicense: 'DL123456',
      };

      const mockVehicle = {
        id: 'vehicle-1',
        ownerId: 'owner-1',
        dailyPrice: 8500,
        isAvailable: true,
        owner: { id: 'owner-1', name: 'Owner' },
      };

      const mockBooking = {
        id: 'booking-1',
        renterId,
        vehicleId: createDto.vehicleId,
        ownerId: mockVehicle.ownerId,
        startDate: createDto.startDate,
        endDate: createDto.endDate,
        totalPrice: 34000,
        status: 'PENDING',
      };

      prisma.vehicle.findUnique.mockResolvedValue(mockVehicle);
      prisma.booking.findFirst.mockResolvedValue(null); // No conflicts
      prisma.booking.create.mockResolvedValue(mockBooking);

      const result = await service.createBooking(renterId, createDto);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('booking');
      expect(prisma.booking.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if vehicle not found', async () => {
      const createDto = {
        vehicleId: 'non-existent',
        startDate: '2026-03-01',
        endDate: '2026-03-05',
        pickupTime: '10:00',
        returnTime: '10:00',
        driverName: 'John Doe',
        driverPhone: '+254712345678',
        driverLicense: 'DL123456',
      };

      prisma.vehicle.findUnique.mockResolvedValue(null);

      await expect(service.createBooking('renter-1', createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserBookings', () => {
    it('should return bookings for user', async () => {
      const userId = 'user-1';
      const mockBookings = [
        {
          id: 'booking-1',
          renterId: userId,
          vehicleId: 'vehicle-1',
          status: 'PENDING',
        },
      ];

      prisma.booking.findMany.mockResolvedValue(mockBookings);

      const result = await service.getUserBookings(userId);

      expect(result).toEqual(mockBookings);
      expect(prisma.booking.findMany).toHaveBeenCalledWith({
        where: { renterId: userId },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getBooking', () => {
    it('should return a booking by id', async () => {
      const mockBooking = {
        id: 'booking-1',
        renterId: 'renter-1',
        ownerId: 'owner-1',
        vehicleId: 'vehicle-1',
        status: 'PENDING',
        vehicle: {
          id: 'vehicle-1',
          title: 'Toyota Fortuner',
        },
        renter: {
          id: 'renter-1',
          name: 'John Doe',
        },
      };

      prisma.booking.findUnique.mockResolvedValue(mockBooking);

      const result = await service.getBooking('booking-1', 'renter-1');

      expect(result).toEqual(mockBooking);
      expect(prisma.booking.findUnique).toHaveBeenCalledWith({
        where: { id: 'booking-1' },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if booking not found', async () => {
      prisma.booking.findUnique.mockResolvedValue(null);

      await expect(service.getBooking('non-existent', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getOwnerBookings', () => {
    it('should return bookings for owner', async () => {
      const ownerId = 'owner-1';
      const mockBookings = [
        {
          id: 'booking-1',
          ownerId,
          vehicleId: 'vehicle-1',
          status: 'PENDING',
        },
      ];

      prisma.booking.findMany.mockResolvedValue(mockBookings);

      const result = await service.getOwnerBookings(ownerId);

      expect(result).toEqual(mockBookings);
      expect(prisma.booking.findMany).toHaveBeenCalledWith({
        where: { ownerId },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('updateBookingStatus', () => {
    it('should update booking status', async () => {
      const bookingId = 'booking-1';
      const ownerId = 'owner-1';
      const newStatus = 'CONFIRMED';

      const mockBooking = {
        id: bookingId,
        renterId: 'renter-1',
        ownerId,
        status: 'PENDING',
        vehicle: {},
      };

      const updatedBooking = {
        ...mockBooking,
        status: newStatus,
      };

      prisma.booking.findUnique.mockResolvedValue(mockBooking);
      prisma.booking.update.mockResolvedValue(updatedBooking);

      const result = await service.updateBookingStatus(bookingId, ownerId, newStatus);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('booking');
      expect(prisma.booking.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if booking not found', async () => {
      prisma.booking.findUnique.mockResolvedValue(null);

      await expect(
        service.updateBookingStatus('non-existent', 'owner-1', 'CONFIRMED'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

import { bookingFactory, vehicleFactory } from '../factories/factories';

// Mock Prisma client module path used in the app. Adjust import path to match project.
const mockPrisma = {
  booking: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  vehicle: {
    findUnique: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

// Example unit test for booking creation logic
describe('Booking Service - unit', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should create a booking when vehicle is available', async () => {
    const booking = bookingFactory();
    mockPrisma.vehicle.findUnique.mockResolvedValue(vehicleFactory({ id: booking.vehicleId, isAvailable: true }));
    mockPrisma.booking.create.mockResolvedValue(booking);

    // Require service under test dynamically to pick up mocked prisma
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { BookingsService } = require('../../../src/bookings/bookings.service');
    const svc = new BookingsService(new (require('@prisma/client').PrismaClient)());

    const result = await svc.createBooking(booking.renterId, {
      vehicleId: booking.vehicleId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      needsDelivery: false,
      totalPrice: booking.totalPrice,
    });

    expect(mockPrisma.vehicle.findUnique).toHaveBeenCalled();
    expect(mockPrisma.booking.create).toHaveBeenCalled();
    expect(result).toMatchObject({ booking: expect.any(Object) });
  });

  it('should reject if vehicle is unavailable', async () => {
    const booking = bookingFactory();
    mockPrisma.vehicle.findUnique.mockResolvedValue(vehicleFactory({ id: booking.vehicleId, isAvailable: false }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { BookingsService } = require('../../../src/bookings/bookings.service');
    const svc = new BookingsService(new (require('@prisma/client').PrismaClient)());

    await expect(
      svc.createBooking(booking.renterId, {
        vehicleId: booking.vehicleId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        needsDelivery: false,
        totalPrice: booking.totalPrice,
      }),
    ).rejects.toThrow('Vehicle is not available');
  });
});

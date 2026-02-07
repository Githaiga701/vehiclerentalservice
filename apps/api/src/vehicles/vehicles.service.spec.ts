import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { PrismaService } from '../database/prisma.service';
import { mockPrismaService } from '../test/test-utils';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    prisma = mockPrismaService;

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated vehicles', async () => {
      const mockVehicles = [
        {
          id: 'vehicle-1',
          title: 'Toyota Fortuner',
          category: 'SUV',
          dailyPrice: 8500,
          location: 'Nairobi',
          ownerId: 'owner-1',
        },
        {
          id: 'vehicle-2',
          title: 'Nissan X-Trail',
          category: 'SUV',
          dailyPrice: 6500,
          location: 'Mombasa',
          ownerId: 'owner-2',
        },
      ];

      prisma.vehicle.findMany.mockResolvedValue(mockVehicles);
      prisma.vehicle.count.mockResolvedValue(2);

      const result = await service.findAll({
        page: 1,
        limit: 10,
      });

      expect(result.data).toEqual(mockVehicles);
      expect(result.meta).toEqual({
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter by category', async () => {
      const mockVehicles = [
        {
          id: 'vehicle-1',
          title: 'Toyota Fortuner',
          category: 'SUV',
          dailyPrice: 8500,
        },
      ];

      prisma.vehicle.findMany.mockResolvedValue(mockVehicles);
      prisma.vehicle.count.mockResolvedValue(1);

      await service.findAll({
        page: 1,
        limit: 10,
        category: 'SUV',
      });

      expect(prisma.vehicle.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: expect.objectContaining({ contains: 'SUV' }),
          }),
        }),
      );
    });

    it('should filter by price range', async () => {
      prisma.vehicle.findMany.mockResolvedValue([]);
      prisma.vehicle.count.mockResolvedValue(0);

      await service.findAll({
        page: 1,
        limit: 10,
        minPrice: 5000,
        maxPrice: 10000,
      });

      expect(prisma.vehicle.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            dailyPrice: {
              gte: 5000,
              lte: 10000,
            },
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a vehicle by id', async () => {
      const mockVehicle = {
        id: 'vehicle-1',
        title: 'Toyota Fortuner',
        category: 'SUV',
        dailyPrice: 8500,
        owner: {
          id: 'owner-1',
          name: 'John Doe',
          phone: '+254712345678',
        },
      };

      prisma.vehicle.findUnique.mockResolvedValue(mockVehicle);

      const result = await service.findOne('vehicle-1');

      expect(result).toEqual(mockVehicle);
      expect(prisma.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: 'vehicle-1' },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if vehicle not found', async () => {
      prisma.vehicle.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new vehicle', async () => {
      const ownerId = 'owner-1';
      const createDto = {
        title: 'Toyota Fortuner',
        category: 'SUV',
        dailyPrice: 8500,
        location: 'Nairobi',
        make: 'Toyota',
        model: 'Fortuner',
        year: 2023,
        transmission: 'Automatic',
        fuelType: 'Diesel',
        seats: 7,
        features: JSON.stringify(['AC', 'GPS']),
      };

      const mockVehicle = {
        id: 'vehicle-1',
        ...createDto,
        ownerId,
        status: 'PENDING',
      };

      prisma.vehicle.create.mockResolvedValue(mockVehicle);

      const result = await service.create(ownerId, createDto);

      expect(result).toEqual(mockVehicle);
      expect(prisma.vehicle.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            ownerId,
            status: 'PENDING',
          }),
        }),
      );
    });
  });

  describe('update', () => {
    it('should update a vehicle', async () => {
      const vehicleId = 'vehicle-1';
      const ownerId = 'owner-1';
      const updateDto = {
        dailyPrice: 9000,
        isAvailable: false,
      };

      const mockVehicle = {
        id: vehicleId,
        ownerId,
        title: 'Toyota Fortuner',
        dailyPrice: 8500,
      };

      const updatedVehicle = {
        ...mockVehicle,
        ...updateDto,
      };

      prisma.vehicle.findUnique.mockResolvedValue(mockVehicle);
      prisma.vehicle.update.mockResolvedValue(updatedVehicle);

      const result = await service.update(vehicleId, ownerId, updateDto);

      expect(result).toEqual(updatedVehicle);
      expect(prisma.vehicle.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if vehicle not found', async () => {
      prisma.vehicle.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent', 'owner-1', {}),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if not owner', async () => {
      const mockVehicle = {
        id: 'vehicle-1',
        ownerId: 'owner-1',
        title: 'Toyota Fortuner',
      };

      prisma.vehicle.findUnique.mockResolvedValue(mockVehicle);

      await expect(
        service.update('vehicle-1', 'different-owner', {}),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete a vehicle', async () => {
      const vehicleId = 'vehicle-1';
      const ownerId = 'owner-1';

      const mockVehicle = {
        id: vehicleId,
        ownerId,
        title: 'Toyota Fortuner',
      };

      prisma.vehicle.findUnique.mockResolvedValue(mockVehicle);
      prisma.vehicle.delete.mockResolvedValue(mockVehicle);

      const result = await service.remove(vehicleId, ownerId);

      expect(result).toEqual({ message: 'Vehicle deleted successfully' });
      expect(prisma.vehicle.delete).toHaveBeenCalledWith({
        where: { id: vehicleId },
      });
    });

    it('should throw ForbiddenException if not owner', async () => {
      const mockVehicle = {
        id: 'vehicle-1',
        ownerId: 'owner-1',
        title: 'Toyota Fortuner',
      };

      prisma.vehicle.findUnique.mockResolvedValue(mockVehicle);

      await expect(
        service.remove('vehicle-1', 'different-owner'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getOwnerVehicles', () => {
    it('should return vehicles for owner', async () => {
      const ownerId = 'owner-1';
      const mockVehicles = [
        {
          id: 'vehicle-1',
          title: 'Toyota Fortuner',
          ownerId,
        },
        {
          id: 'vehicle-2',
          title: 'Nissan X-Trail',
          ownerId,
        },
      ];

      prisma.vehicle.findMany.mockResolvedValue(mockVehicles);

      const result = await service.getOwnerVehicles(ownerId);

      expect(result).toEqual(mockVehicles);
      expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
        where: { ownerId },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('updateAvailability', () => {
    it('should update vehicle availability', async () => {
      const vehicleId = 'vehicle-1';
      const ownerId = 'owner-1';
      const isAvailable = false;

      const mockVehicle = {
        id: vehicleId,
        ownerId,
        title: 'Toyota Fortuner',
        isAvailable: true,
      };

      const updatedVehicle = {
        ...mockVehicle,
        isAvailable,
      };

      prisma.vehicle.findUnique.mockResolvedValue(mockVehicle);
      prisma.vehicle.update.mockResolvedValue(updatedVehicle);

      const result = await service.updateAvailability(
        vehicleId,
        ownerId,
        isAvailable,
      );

      expect(result.isAvailable).toBe(isAvailable);
      expect(prisma.vehicle.update).toHaveBeenCalledWith({
        where: { id: vehicleId },
        data: { isAvailable },
      });
    });
  });
});

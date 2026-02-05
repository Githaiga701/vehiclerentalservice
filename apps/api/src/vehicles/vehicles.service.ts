import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateVehicleDto, UpdateVehicleDto, VehicleSearchDto, AssignDriverDto } from './dto/vehicle.dto';

@Injectable()
export class VehiclesService {
  private readonly isSQLite: boolean;

  constructor(private readonly prisma: PrismaService) {
    // Detect database provider from environment or Prisma config
    const databaseUrl = process.env.DATABASE_URL || '';
    this.isSQLite = databaseUrl.includes('file:') || databaseUrl.includes('.db');
  }

  /**
   * Helper method to create case-insensitive string filter
   * Works for SQLite, PostgreSQL, and MySQL
   */
  private stringFilter(value: string) {
    if (this.isSQLite) {
      // SQLite doesn't support mode, so we'll use contains without it
      // For better SQLite support, you could convert to lowercase on both sides
      return { contains: value };
    }
    // PostgreSQL and MySQL support case-insensitive mode
    return { contains: value, mode: 'insensitive' as any };
  }

  async create(ownerId: string, dto: CreateVehicleDto, files?: { images?: Express.Multer.File[], documents?: Express.Multer.File[] }) {
    // Process uploaded files
    const imageUrls: string[] = [];
    const documentUrls: string[] = [];

    if (files?.images) {
      for (const image of files.images) {
        // In a real app, you'd upload to cloud storage (AWS S3, Cloudinary, etc.)
        // For now, we'll just store the filename
        imageUrls.push(`/uploads/vehicles/${image.filename}`);
      }
    }

    if (files?.documents) {
      for (const doc of files.documents) {
        documentUrls.push(`/uploads/documents/${doc.filename}`);
      }
    }

    // Create title from make and model if not provided
    const title = dto.title || `${dto.make} ${dto.model}`.trim();

    // Parse features if provided
    let features = dto.features;
    if (typeof features === 'string') {
      try {
        // Validate it's a proper JSON array
        const parsed = JSON.parse(features);
        if (Array.isArray(parsed)) {
          features = JSON.stringify(parsed);
        }
      } catch (e) {
        // If parsing fails, treat as empty array
        features = JSON.stringify([]);
      }
    }

    return this.prisma.vehicle.create({
      data: {
        ...dto,
        title,
        features,
        ownerId,
        images: JSON.stringify(imageUrls),
        documents: JSON.stringify(documentUrls),
        status: 'PENDING', // Vehicles need approval
      },
      include: {
        driver: true,
        owner: {
          select: { id: true, name: true, phone: true },
        },
      },
    });
  }

  async findAll(searchDto: VehicleSearchDto) {
    const { page = 1, limit = 10, category, location, minPrice, maxPrice, seats, transmission, fuelType, withDriver, available } = searchDto;

    const where: any = {};

    if (category) {
      where.category = this.stringFilter(category);
    }

    if (location) {
      where.location = this.stringFilter(location);
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.dailyPrice = {};
      if (minPrice !== undefined) where.dailyPrice.gte = minPrice;
      if (maxPrice !== undefined) where.dailyPrice.lte = maxPrice;
    }

    if (seats) {
      where.seats = seats;
    }

    if (transmission) {
      where.transmission = this.stringFilter(transmission);
    }

    if (fuelType) {
      where.fuelType = this.stringFilter(fuelType);
    }

    if (withDriver !== undefined) {
      where.withDriver = withDriver;
    }

    if (available !== undefined) {
      where.isAvailable = available;
    }

    const [vehicles, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where,
        include: {
          driver: true,
          owner: {
            select: { id: true, name: true, phone: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vehicle.count({ where }),
    ]);

    return {
      data: vehicles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        driver: true,
        owner: {
          select: { id: true, name: true, phone: true, email: true },
        },
        bookings: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        ratings: {
          include: {
            rater: {
              select: { id: true, name: true },
            },
          },
          take: 10,
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async update(id: string, ownerId: string, dto: UpdateVehicleDto) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (vehicle.ownerId !== ownerId) {
      throw new ForbiddenException('You can only update your own vehicles');
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: dto,
      include: {
        driver: true,
      },
    });
  }

  async remove(id: string, ownerId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (vehicle.ownerId !== ownerId) {
      throw new ForbiddenException('You can only delete your own vehicles');
    }

    await this.prisma.vehicle.delete({ where: { id } });

    return { message: 'Vehicle deleted successfully' };
  }

  async assignDriver(vehicleId: string, ownerId: string, dto: AssignDriverDto) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (vehicle.ownerId !== ownerId) {
      throw new ForbiddenException('You can only assign drivers to your own vehicles');
    }

    // Check if driver already exists
    const existingDriver = await this.prisma.driver.findUnique({ where: { vehicleId } });

    if (existingDriver) {
      // Update existing driver
      return this.prisma.driver.update({
        where: { vehicleId },
        data: dto,
      });
    }

    // Create new driver
    return this.prisma.driver.create({
      data: {
        ...dto,
        vehicleId,
      },
    });
  }

  async removeDriver(vehicleId: string, ownerId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (vehicle.ownerId !== ownerId) {
      throw new ForbiddenException('You can only remove drivers from your own vehicles');
    }

    const driver = await this.prisma.driver.findUnique({ where: { vehicleId } });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    await this.prisma.driver.delete({ where: { vehicleId } });

    return { message: 'Driver removed successfully' };
  }

  async getOwnerVehicles(ownerId: string) {
    return this.prisma.vehicle.findMany({
      where: { ownerId },
      include: {
        driver: true,
        bookings: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateAvailability(id: string, ownerId: string, isAvailable: boolean) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (vehicle.ownerId !== ownerId) {
      throw new ForbiddenException('You can only update availability of your own vehicles');
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: { isAvailable },
    });
  }
}

import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateKycDto } from './dto/kyc.dto';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  constructor(private readonly prisma: PrismaService) {}

  async submitKyc(
    userId: string,
    dto: CreateKycDto,
    files: {
      idFront?: Express.Multer.File[];
      idBack?: Express.Multer.File[];
      selfie?: Express.Multer.File[];
    }
  ): Promise<{ message: string }> {
    // Check if KYC already exists
    const existingKyc = await this.prisma.kYC.findUnique({
      where: { userId },
    });

    if (existingKyc && existingKyc.status !== 'REJECTED') {
      throw new ConflictException('KYC already submitted');
    }

    // In a real application, you would:
    // 1. Upload files to cloud storage (AWS S3, Google Cloud Storage, etc.)
    // 2. Validate file types and sizes
    // 3. Scan for malware
    // 4. Extract text from ID documents for verification
    
    // For now, we'll simulate file storage
    const uploadDir = path.join(process.cwd(), 'uploads', 'kyc', userId);
    
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
      this.logger.error('Failed to create upload directory', error);
    }

    let idFrontUrl = '';
    let idBackUrl = '';
    let selfieUrl = '';

    // Simulate file uploads
    if (files.idFront?.[0]) {
      idFrontUrl = `/uploads/kyc/${userId}/id-front.jpg`;
      this.logger.log(`ID Front uploaded: ${idFrontUrl}`);
    }

    if (files.idBack?.[0]) {
      idBackUrl = `/uploads/kyc/${userId}/id-back.jpg`;
      this.logger.log(`ID Back uploaded: ${idBackUrl}`);
    }

    if (files.selfie?.[0]) {
      selfieUrl = `/uploads/kyc/${userId}/selfie.jpg`;
      this.logger.log(`Selfie uploaded: ${selfieUrl}`);
    }

    // Create or update KYC record
    const kycData = {
      userId,
      fullName: dto.fullName,
      nationalId: dto.nationalId,
      address: dto.address,
      city: dto.city || '',
      latitude: dto.latitude ? parseFloat(dto.latitude) : null,
      longitude: dto.longitude ? parseFloat(dto.longitude) : null,
      idFrontUrl,
      idBackUrl,
      selfieUrl,
      status: 'PENDING' as const,
    };

    if (existingKyc) {
      await this.prisma.kYC.update({
        where: { userId },
        data: kycData,
      });
    } else {
      await this.prisma.kYC.create({
        data: kycData,
      });
    }

    // Update user's trust score
    await this.prisma.trustScore.upsert({
      where: { userId },
      update: { kycCompleted: true },
      create: { userId, kycCompleted: true },
    });

    this.logger.log(`KYC submitted for user ${userId}`);

    return {
      message: 'KYC documents submitted successfully. We will review and get back to you within 24-48 hours.',
    };
  }

  async getKycStatus(userId: string) {
    const kyc = await this.prisma.kYC.findUnique({
      where: { userId },
      select: {
        status: true,
        createdAt: true,
        fullName: true,
        nationalId: true,
        address: true,
      },
    });

    if (!kyc) {
      return { status: null, message: 'KYC not submitted' };
    }

    return {
      status: kyc.status,
      submittedAt: kyc.createdAt,
      documents: {
        fullName: kyc.fullName,
        nationalId: kyc.nationalId,
        address: kyc.address,
      },
    };
  }

  async getPendingKyc() {
    const pendingKyc = await this.prisma.kYC.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return pendingKyc.map(kyc => ({
      userId: kyc.userId,
      name: kyc.user.name || kyc.fullName,
      phone: kyc.user.phone,
      email: kyc.user.email,
      nationalId: kyc.nationalId,
      address: kyc.address,
      city: kyc.city,
      status: kyc.status,
      submittedAt: kyc.createdAt.toISOString().split('T')[0],
      documents: [
        kyc.idFrontUrl && 'id-front.jpg',
        kyc.idBackUrl && 'id-back.jpg',
        kyc.selfieUrl && 'selfie.jpg',
      ].filter(Boolean),
      fullData: {
        fullName: kyc.fullName,
        nationalId: kyc.nationalId,
        address: kyc.address,
        city: kyc.city,
        latitude: kyc.latitude,
        longitude: kyc.longitude,
        idFrontUrl: kyc.idFrontUrl,
        idBackUrl: kyc.idBackUrl,
        selfieUrl: kyc.selfieUrl,
      },
    }));
  }

  async updateKycStatus(userId: string, status: 'APPROVED' | 'REJECTED') {
    const kyc = await this.prisma.kYC.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!kyc) {
      throw new Error('KYC submission not found');
    }

    // Update KYC status
    await this.prisma.kYC.update({
      where: { userId },
      data: { status },
    });

    // Update user's KYC status
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        // You might want to add a kycStatus field to the User model
      },
    });

    // Update trust score
    await this.prisma.trustScore.upsert({
      where: { userId },
      update: { 
        kycCompleted: status === 'APPROVED',
        score: status === 'APPROVED' ? 75 : 25,
      },
      create: { 
        userId, 
        kycCompleted: status === 'APPROVED',
        score: status === 'APPROVED' ? 75 : 25,
      },
    });

    this.logger.log(`KYC ${status.toLowerCase()} for user ${userId} (${kyc.user.name})`);

    return {
      message: `KYC ${status.toLowerCase()} successfully`,
      user: {
        name: kyc.user.name,
        phone: kyc.user.phone,
      },
      status,
    };
  }
}
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly prisma: PrismaService) {}

  async submitContact(dto: CreateContactDto): Promise<{ message: string }> {
    // Log sanitized contact form submission (no PII)
    this.logger.log(`Contact form submitted - Subject: ${dto.subject}`);
    
    // Save to database
    await this.prisma.contact.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone || null,
        subject: dto.subject,
        message: dto.message,
        status: 'UNREAD',
      },
    });

    // In a real application, you would also:
    // 1. Send email notification to admin
    // 2. Send confirmation email to user
    // 3. Integrate with CRM system

    return {
      message: 'Thank you for your message! We will get back to you within 24 hours.',
    };
  }

  async getAllContacts(status?: string) {
    const where = status ? { status: status as any } : {};
    
    return this.prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getContactById(id: string) {
    return this.prisma.contact.findUnique({
      where: { id },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.contact.update({
      where: { id },
      data: { status: 'READ' },
    });
  }

  async markAsReplied(id: string, repliedBy: string, notes?: string) {
    return this.prisma.contact.update({
      where: { id },
      data: {
        status: 'REPLIED',
        repliedAt: new Date(),
        repliedBy,
        notes,
      },
    });
  }

  async archiveContact(id: string) {
    return this.prisma.contact.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
  }

  async deleteContact(id: string) {
    return this.prisma.contact.delete({
      where: { id },
    });
  }

  async getUnreadCount() {
    return this.prisma.contact.count({
      where: { status: 'UNREAD' },
    });
  }
}

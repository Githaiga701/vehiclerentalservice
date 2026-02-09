import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async submitContact(@Body() dto: CreateContactDto) {
    return this.contactService.submitContact(dto);
  }

  // Admin endpoints
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllContacts(@Query('status') status?: string) {
    return this.contactService.getAllContacts(status);
  }

  @Get('admin/unread-count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getUnreadCount() {
    const count = await this.contactService.getUnreadCount();
    return { count };
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getContactById(@Param('id') id: string) {
    return this.contactService.getContactById(id);
  }

  @Put('admin/:id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  @Put('admin/:id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async markAsReplied(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('notes') notes?: string,
  ) {
    return this.contactService.markAsReplied(id, user.sub, notes);
  }

  @Put('admin/:id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async archiveContact(@Param('id') id: string) {
    return this.contactService.archiveContact(id);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteContact(@Param('id') id: string) {
    return this.contactService.deleteContact(id);
  }
}
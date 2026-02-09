import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private twilioClient: any;
  private whatsappNumber: string;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    this.whatsappNumber = this.configService.get('TWILIO_WHATSAPP_NUMBER') || 'whatsapp:+14155238886'; // Sandbox number

    if (accountSid && authToken) {
      try {
        // Dynamically import Twilio (install with: pnpm add twilio)
        const twilio = require('twilio');
        this.twilioClient = twilio(accountSid, authToken);
        this.logger.log('WhatsApp service initialized');
      } catch (error) {
        this.logger.warn('Twilio not installed. Run: pnpm add twilio');
      }
    } else {
      this.logger.warn('Twilio credentials not configured. WhatsApp OTP disabled.');
    }
  }

  async sendOTP(phone: string, otp: string): Promise<boolean> {
    if (!this.twilioClient) {
      this.logger.warn('WhatsApp not configured, skipping OTP send');
      return false;
    }

    try {
      // Format phone number for WhatsApp
      const whatsappPhone = `whatsapp:${phone}`;

      const message = await this.twilioClient.messages.create({
        from: this.whatsappNumber,
        to: whatsappPhone,
        body: `Your VehicleRent Kenya verification code is: ${otp}\n\nThis code expires in 5 minutes.\n\nDo not share this code with anyone.`,
      });

      this.logger.log(`WhatsApp OTP sent to ${phone}: ${message.sid}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp OTP to ${phone}:`, error.message);
      return false;
    }
  }

  async sendMessage(phone: string, message: string): Promise<boolean> {
    if (!this.twilioClient) {
      this.logger.warn('WhatsApp not configured');
      return false;
    }

    try {
      const whatsappPhone = `whatsapp:${phone}`;

      const msg = await this.twilioClient.messages.create({
        from: this.whatsappNumber,
        to: whatsappPhone,
        body: message,
      });

      this.logger.log(`WhatsApp message sent to ${phone}: ${msg.sid}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message to ${phone}:`, error.message);
      return false;
    }
  }

  isConfigured(): boolean {
    return this.twilioClient !== null && this.twilioClient !== undefined;
  }
}

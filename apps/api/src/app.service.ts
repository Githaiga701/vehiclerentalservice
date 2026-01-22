import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'NestJS API for Vehicle Rental Service is running.';
  }
}


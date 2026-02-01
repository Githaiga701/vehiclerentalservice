import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ContactModule } from './contact/contact.module';
import { KycModule } from './kyc/kyc.module';
import { BookingsModule } from './bookings/bookings.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    VehiclesModule,
    ContactModule,
    KycModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}


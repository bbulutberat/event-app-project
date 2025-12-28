import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- BU EKLENDİ
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity'; // <--- BU EKLENDİ

@Module({
  imports: [TypeOrmModule.forFeature([Event])], // <--- KRİTİK NOKTA BURASI
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { CategoriesModule } from './categories/categories.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { User } from './users/entities/user.entity';
import { Event } from './events/entities/event.entity';
import { Category } from './categories/entities/category.entity';
import { Registration } from './registrations/entities/registration.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // ÖNEMLİ AYAR: Eğer Render bize bir URL verirse onu kullan, yoksa localhost'u kullan.
      url: process.env.DATABASE_URL || 'postgres://postgres:197453@localhost:5432/eventdb', 
      
      entities: [User, Event, Category, Registration],
      synchronize: true, // Tabloları otomatik oluşturur
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false, // Render için SSL gerekli
    }),
    UsersModule,
    EventsModule,
    CategoriesModule,
    RegistrationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}